function generateCertificate() {
    const generateButton = document.getElementById('generateButton');
    const resetLoading = showLoading(generateButton);
    const demoPreview = document.getElementById('demoPreview');
    const canvas = document.getElementById('certificateCanvas');

    try {
        const name = document.getElementById("nameInput").value;
        const canvas = document.getElementById("certificateCanvas");
        const ctx = canvas.getContext("2d");

        // Load the certificate background image
        const img = new Image();
        img.src = "certificate.png";  // Replace with your certificate image path

        img.onload = function() {
            // Set canvas size to match the image dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the background image at its original resolution
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // Set the text properties
            ctx.font = "700 90px 'Dancing Script', cursive";
            ctx.fillStyle = "black";  // Adjust color based on your certificate design
            ctx.textAlign = "center";
            
            // Position the text
            const textX = canvas.width / 2; // Center of canvas width
            const textY = canvas.height * 0.53; // Approximate position (adjust as needed)

            // Draw the name on the certificate
            ctx.fillText(name, textX, textY);
            
            // Set the text properties for the date
            ctx.font = "400 35px 'Arial' ";
            ctx.textAlign = "left"; // Align text to the left

            // Get the date value
            const dateInput = document.getElementById('dateInput');
            const selectedDate = new Date(dateInput.value);

            // Format the date (DD/MM/YYYY)
            const formattedDate = selectedDate.getDate().toString().padStart(2, '0') + '/' +
                                  (selectedDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                  selectedDate.getFullYear();

            // Position the date text
            const dateX = 385;
            const dateY = 1330;
            ctx.fillText(formattedDate, dateX, dateY);
        };

        // Show the download button after certificate is generated
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.style.display = 'block';

        // Hide demo and show canvas
        demoPreview.style.display = 'none';
        canvas.style.display = 'block';
        canvas.classList.add('fade-in');

    } catch (error) {
        console.error('Error:', error);
        showNotification(
            "There was an error generating the certificate. Please try again.",
            'error'
        );
    } finally {
        resetLoading();
    }
}

// Add download button functionality
document.getElementById('downloadBtn').addEventListener('click', async function() {
    const button = this;
    button.disabled = true;
    button.textContent = 'Downloading...';
    
    try {
        const link = document.createElement('a');
        const canvas = document.getElementById('certificateCanvas');
        const dataURL = canvas.toDataURL('image/png');
        
        link.download = '100xdevs.png';
        link.href = dataURL;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    } finally {
        button.disabled = false;
        button.textContent = 'Download Certificate';
    }
});

// Add loading states
function showLoading(button) {
    button.disabled = true;
    button.classList.add('loading');
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    return () => {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = originalText;
    };
}

// Add success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.container').insertBefore(successDiv, document.querySelector('.canvas-container'));
    setTimeout(() => successDiv.remove(), 3000);
}

// Update your existing event listeners
document.getElementById('generateButton').addEventListener('click', async function() {
    const resetLoading = showLoading(this);
    try {
        await generateCertificate();
        showSuccess('Certificate generated successfully!');
        document.getElementById('downloadBtn').style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Failed to generate certificate. Please try again.');
    } finally {
        resetLoading();
    }
});

// Add this function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);

    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
        notification.remove();
    }, 10000);
}

// Add this to your window load event
window.addEventListener('load', () => {
    showNotification(
        "Note: If the certificate text appears in a basic font, please refresh your browser to load the stylized font correctly.",
        'info'
    );
});

// Optional: Add hover effect to demo
document.getElementById('demoPreview').addEventListener('mouseover', function() {
    this.querySelector('.demo-overlay').style.background = 'rgba(0, 0, 0, 0.7)';
});

document.getElementById('demoPreview').addEventListener('mouseout', function() {
    this.querySelector('.demo-overlay').style.background = 'rgba(0, 0, 0, 0.6)';
});

// Optional: Add input monitoring to update overlay text
function updateOverlayText() {
    const name = document.getElementById('nameInput').value;
    const date = document.getElementById('dateInput').value;
    const overlay = document.querySelector('.demo-overlay p');
    
    if (name && date) {
        overlay.textContent = 'Click Generate to create your certificate';
    } else {
        overlay.textContent = 'Enter your details above to generate your certificate';
    }
}

document.getElementById('nameInput').addEventListener('input', updateOverlayText);
document.getElementById('dateInput').addEventListener('input', updateOverlayText);
