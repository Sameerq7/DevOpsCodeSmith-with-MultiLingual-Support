document.getElementById("generateCodeBtn").addEventListener("click", async () => {
    const problemStatement = document.getElementById("problemStatement").value;
    document.getElementById("spinner").style.display = "block";
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
        document.getElementById("spinner").style.display = "none";
    }
});

document.getElementById("copyCodeBtn").addEventListener("click", () => {
    const code = codeMirrorOutput.getValue();
    if (code) {
        navigator.clipboard.writeText(code).then(() => {
            console.log("Code copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy code: " + err);
        });
    } else {
        alert("No code to copy.");
    }
});
