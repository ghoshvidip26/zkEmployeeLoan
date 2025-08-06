import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.eml')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only .eml files are allowed.' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    
    // Basic email parsing to extract key information
    const emailData = parseEmailFile(fileContent);
    
    // Here you would typically:
    // 1. Store the file in a secure location
    // 2. Process the email for salary verification
    // 3. Create a ZK proof of the email content
    // 4. Store metadata in database
    
    return NextResponse.json({
      success: true,
      message: 'Email file uploaded successfully',
      data: {
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        emailData: emailData
      }
    });

  } catch (error) {
    console.error('Error uploading .eml file:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

function parseEmailFile(content: string) {
  try {
    const lines = content.split('\n');
    const emailData: any = {
      headers: {},
      body: ''
    };
    
    let isHeader = true;
    let bodyStarted = false;
    
    for (const line of lines) {
      if (isHeader && line.trim() === '') {
        isHeader = false;
        bodyStarted = true;
        continue;
      }
      
      if (isHeader) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const headerName = line.substring(0, colonIndex).toLowerCase();
          const headerValue = line.substring(colonIndex + 1).trim();
          emailData.headers[headerName] = headerValue;
        }
      } else if (bodyStarted) {
        emailData.body += line + '\n';
      }
    }
    
    // Extract key salary-related information
    const salaryKeywords = ['salary', 'pay', 'payment', 'compensation', 'wage', 'income', 'earnings'];
    const bodyLower = emailData.body.toLowerCase();
    
    emailData.containsSalaryInfo = salaryKeywords.some(keyword => 
      bodyLower.includes(keyword)
    );
    
    // Extract sender information
    emailData.sender = emailData.headers['from'] || 'Unknown';
    emailData.subject = emailData.headers['subject'] || 'No Subject';
    emailData.date = emailData.headers['date'] || 'Unknown Date';
    
    return emailData;
  } catch (error) {
    console.error('Error parsing email file:', error);
    return {
      error: 'Failed to parse email content',
      containsSalaryInfo: false
    };
  }
}
