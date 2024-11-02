document.getElementById("generateCodeBtn").addEventListener("click", async () => {
    const problemStatement = document.getElementById("problemStatement").value;
    document.getElementById("spinner").style.display = "block";
    codeMirrorOutput.setValue(""); // Clear the previous output

    try {
        const response = await fetch("/api/code/generate-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ problem: problemStatement })
        });
        
        if (response.ok) {
            const data = await response.json();
            codeMirrorOutput.setValue(data.code || "No code generated.");
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
