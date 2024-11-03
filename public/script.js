document.getElementById("generateCodeBtn").addEventListener("click", async () => {
    const problemStatement = document.getElementById("problemStatement").value;
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block"; // Show spinner
    codeMirrorOutput.setValue(""); // Clear the previous output

    // Determine base URL based on environment
    const baseURL = window.location.hostname.includes('localhost') 
        ? 'http://localhost:3000' 
        : 'https://devopscodesmith-with-multilingual-support.onrender.com';

    try {
        const response = await fetch(`${baseURL}/api/code/generate-code`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Include credentials for session handling
            body: JSON.stringify({ problem: problemStatement })
        });
        
        if (response.ok) {
            const data = await response.json();
            codeMirrorOutput.setValue(data.code || "No code generated.");
        } else {
            codeMirrorOutput.setValue("Error: Unable to generate code.");
        }
    } catch (error) {
        codeMirrorOutput.setValue("Network error ");
    } finally {
        spinner.style.display = "none"; // Hide spinner
    }
});

document.getElementById("copyCodeBtn").addEventListener("click", () => {
    const code = codeMirrorOutput.getValue();
    const copyButton = document.getElementById("copyCodeBtn");
    if (code) {
        navigator.clipboard.writeText(code).then(() => {
            copyButton.innerHTML = '<i class="bi bi-check-circle"></i>'; // Change to checkmark
            setTimeout(() => {
                copyButton.innerHTML = 'Copy to Clipboard'; // Reset back to original text
            }, 2000); // Change back after 2 seconds
            console.log("Code copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy code: " + err);
        });
    } else {
        alert("No code to copy.");
    }
});
