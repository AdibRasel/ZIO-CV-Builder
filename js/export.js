
/**
 * ZIO CV Builder
 * Import, Export and PDF
 */

window.CVExport = (() => {
    const $ = selector => document.querySelector(selector);

    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    function exportJSON() {
        const data = CVEditor.readForm();

        const json = JSON.stringify(data, null, 4);

        downloadFile(
            json,
            "zio-cv-data.json",
            "application/json"
        );
    }

    function importJSON(file) {
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".json")) {
            alert("Please select a valid JSON file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            try {
                const imported = JSON.parse(reader.result);

                if (
                    typeof imported !== "object" ||
                    imported === null ||
                    Array.isArray(imported)
                ) {
                    throw new Error("Invalid CV data.");
                }

                const normalized = CVData.normalize(imported);

                document.dispatchEvent(
                    new CustomEvent("cv:import", {
                        detail: normalized
                    })
                );

            } catch (error) {
                console.error("Import error:", error);
                alert("Invalid JSON file. Please check your CV data.");
            }
        };

        reader.onerror = () => {
            alert("Could not read the selected file.");
        };

        reader.readAsText(file);
    }

    function downloadPDF() {
        try {
            const data = CVEditor.readForm();

            CVData.setData(data);
            CVPreview.render(data);

            // Open the browser's native Print / Save as PDF dialog.
            window.print();

        } catch (error) {
            console.error("PDF export error:", error);
            alert("Unable to generate PDF. Please check the CV data.");
        }
    }

    function bindEvents() {
        $("#exportBtn")?.addEventListener("click", event => {
            event.preventDefault();
            exportJSON();
        });

        $("#importBtn")?.addEventListener("click", event => {
            event.preventDefault();
            $("#importFile")?.click();
        });

        $("#importFile")?.addEventListener("change", event => {
            const file = event.target.files?.[0];

            if (file) {
                importJSON(file);
            }

            event.target.value = "";
        });

        $("#downloadBtn")?.addEventListener("click", event => {
            event.preventDefault();
            downloadPDF();
        });
    }

    return {
        bindEvents,
        exportJSON,
        importJSON,
        downloadPDF
    };
})();
