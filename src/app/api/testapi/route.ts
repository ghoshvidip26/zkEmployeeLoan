import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(request: NextRequest){
  const msg = {
    to: 'vidip2001@gmail.com',
    from: 'ghoshvidip26@gmail.com',
    subject: 'Hello from Sendgrid',
    text: 'This is a test email sent using SendGrid',
    html: '<strong>This is a test email sent using SendGrid</strong>'
  }
  sgMail.send(msg).then((res)=>{
    console.log('Email sent successfully:', res);
  }).catch((err)=>{
    console.log("error in sending email:", err);
  })
  return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
}

// Simple GET handler to avoid 405 error and allow browser testing
export async function GET() {
  return NextResponse.json({ message: 'GET request successful. Use POST to send email.' }, { status: 200 });
}

// export async function POST(request: NextRequest) {
//   try {
//     // Just send a fake email directly, no body parsing
//     const msg = {
//       to: 'nithinkatkam504106@gmail.com',
//       from: 'em2271.wooecomblinks.online',
//       subject: 'Test email from POST',
//       text: 'This is a fake test email from POST method',
//       html: '<p>This is a fake test email from POST method</p>'
//     };

//     // Send the email
//     const response = await sgMail.send(msg);
    
//     console.log('Email sent successfully:', response[0].statusCode);
    
//     return NextResponse.json(
//       { 
//         success: true, 
//         message: 'Email sent successfully',
//         statusCode: response[0].statusCode,
//         emailSentTo: msg.to
//       },
//       { status: 200 }
//     );

//   } catch (error: any) {
//     console.error('SendGrid Error:', error);
    
//     // Handle SendGrid specific errors
//     if (error.response) {
//       console.error('SendGrid API Error Body:', error.response.body);
//       return NextResponse.json(
//         { 
//           error: 'SendGrid API Error',
//           details: error.response.body,
//           statusCode: error.code
//         },
//         { status: error.code || 500 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         error: 'Failed to send email',
//         details: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

// // Test GET endpoint to verify API is working
// export async function GET() {
//   try {
//     // Check if API key is configured
//     if (!process.env.SENDGRID_API_KEY) {
//       return NextResponse.json(
//         { 
//           error: 'SENDGRID_API_KEY environment variable is not configured',
//           status: 'API Key Missing'
//         },
//         { status: 500 }
//       );
//     }

//     // Send a simple "Hello World" test email directly
//     const testMsg = {
//       to: 'nithinkatkam504106@gmail.com',
//       from: 'noreply@zkverify.com',
//       subject: 'Hello World testing',
//       text: 'Hello world testing',
//       html: '<p>Hello world testing</p>'
//     };

//     // Send the email
//     console.log('Sending basic test email...');
//     const response = await sgMail.send(testMsg);
    
//     console.log('✅ Email sent successfully!');
    
//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Email sent successfully!',
//         statusCode: response[0].statusCode,
//         emailSentTo: testMsg.to
//       },
//       { status: 200 }
//     );

//   } catch (error: any) {
//     console.error('❌ Email Error:', error);
    
//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to send email',
//         details: error.response?.body || error.message
//       },
//       { status: 500 }
//     );
//   }
// }
