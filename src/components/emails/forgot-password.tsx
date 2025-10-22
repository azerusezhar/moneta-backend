interface ForgotPasswordEmailProps {
  resetLink: string;
  userName: string;
}

export default function ForgotPasswordEmail({ resetLink, userName }: ForgotPasswordEmailProps) {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#333', 
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '24px'
        }}>
          Reset Your Password
        </h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          Hello {userName},
        </p>
        
        <p style={{ 
          color: '#666', 
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a 
            href={resetLink}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px 30px',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Reset Password
          </a>
        </div>
        
        <p style={{ 
          color: '#999', 
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        
        <p style={{ 
          color: '#007bff', 
          fontSize: '14px',
          wordBreak: 'break-all',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #e9ecef'
        }}>
          {resetLink}
        </p>
        
        <hr style={{ 
          border: 'none',
          borderTop: '1px solid #eee',
          margin: '30px 0'
        }} />
        
        <p style={{ 
          color: '#999', 
          fontSize: '12px',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          This link will expire in 1 hour for security reasons.<br />
          If you didn't request this password reset, please ignore this email.
        </p>
        
        <p style={{ 
          color: '#999', 
          fontSize: '12px',
          lineHeight: '1.6',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          Best regards,<br />
          Moneta Team
        </p>
      </div>
    </div>
  );
}
