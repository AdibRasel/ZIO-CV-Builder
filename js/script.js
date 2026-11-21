
/**
 * ZIO CV Builder
 * Main Application
 */

document.addEventListener("DOMContentLoaded", () => {
    const $ = selector => document.querySelector(selector);

    const sectionNames = [
        "personal",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "languages",
        "certifications"
    ];

    let currentSectionIndex = 0;
    let saveTimer = null;

    // --------------------------------
    // SAVE STATUS
    // --------------------------------

    function updateSaveStatus(message, saved = false) {
        const status = $("#saveStatus");
        const indicator = $(".status-indicator");

        if (status) {
            status.textContent = message;
        }

        if (indicator) {
            indicator.classList.toggle("saved", saved);
        }
    }

    function saveImmediately() {
        clearTimeout(saveTimer);

        const data = CVEditor.readForm();

        CVData.setData(data);

        const success = CVData.save();

        updateSaveStatus(
            success ? "All changes saved" : "Unable to save",
            success
        );

        return success;
    }

    function scheduleSave() {
        clearTimeout(saveTimer);

        updateSaveStatus("Saving...");

        saveTimer = setTimeout(() => {
            saveImmediately();
        }, 500);
    }

    // --------------------------------
    // SECTION NAVIGATION
    // --------------------------------

    function showSection(index) {
        if (
            index < 0 ||
            index >= sectionNames.length
        ) {
            return;
        }

        currentSectionIndex = index;

        const sectionId = sectionNames[index];

        document.querySelectorAll(".form-section")
            .forEach(section => {
                section.classList.toggle(
                    "active",
                    section.id === sectionId
                );
            });

        document.querySelectorAll(".nav-item[data-section]")
            .forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.section === sectionId
                );
            });

        const current = String(index + 1).padStart(2, "0");
        const total = String(sectionNames.length).padStart(2, "0");

        const progressText = $("#progressText");
        const progressBar = $("#progressBar");

        if (progressText) {
            progressText.textContent = `${current} / ${total}`;
        }

        if (progressBar) {
            progressBar.style.width =
                `${((index + 1) / sectionNames.length) * 100}%`;
        }

        $(".editor-content")?.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function bindNavigation() {
        document.querySelectorAll(".nav-item[data-section]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const index = sectionNames.indexOf(
                        button.dataset.section
                    );

                    showSection(index);
                });
            });

        $("#prevSection")?.addEventListener("click", () => {
            showSection(currentSectionIndex - 1);
        });

        $("#nextSection")?.addEventListener("click", () => {
            showSection(currentSectionIndex + 1);
        });

        showSection(0);
    }

    // --------------------------------
    // MODE BUTTONS
    // --------------------------------

    function updateModeButtons() {
        const personalButton = $("#personalMode");
        const guestButton = $("#guestMode");

        const isPersonal = CVData.getMode() === "personal";

        personalButton?.classList.toggle(
            "active",
            isPersonal
        );

        guestButton?.classList.toggle(
            "active",
            !isPersonal
        );
    }

    // --------------------------------
    // LOAD PERSONAL MODE
    // --------------------------------

    async function loadPersonalMode() {
        clearTimeout(saveTimer);

        CVData.setMode("personal");

        updateSaveStatus("Loading personal CV...");

        const hasSavedData = CVData.loadSaved();

        if (!hasSavedData) {
            const profile = await CVData.loadDefaultProfile();

            CVData.setData(profile);
            CVData.save();
        }

        const data = CVData.getData();

        CVEditor.fillForm(data);
        CVPreview.render(data);

        updateModeButtons();
        updateSaveStatus("Personal CV loaded", true);

        showSection(0);
    }

    // --------------------------------
    // LOAD GUEST MODE
    // --------------------------------

    function loadGuestMode() {
        clearTimeout(saveTimer);

        CVData.setMode("guest");

        const hasSavedData = CVData.loadSaved();

        if (!hasSavedData) {
            CVData.setData(CVData.emptyCV);
        }

        const data = CVData.getData();

        CVEditor.fillForm(data);
        CVPreview.render(data);

        updateModeButtons();
        updateSaveStatus("Guest CV loaded", true);

        showSection(0);
    }

    // --------------------------------
    // MODE EVENTS
    // --------------------------------

    function bindModeEvents() {
        $("#personalMode")?.addEventListener("click", async () => {
            if (CVData.getMode() !== "personal") {
                saveImmediately();
            }

            try {
                await loadPersonalMode();
            } catch (error) {
                console.error("Personal mode error:", error);
                updateSaveStatus("Could not load personal profile");
            }
        });

        $("#guestMode")?.addEventListener("click", () => {
            if (CVData.getMode() !== "guest") {
                saveImmediately();
            }

            loadGuestMode();
        });
    }

    // --------------------------------
    // LIVE PREVIEW & AUTOSAVE
    // --------------------------------

    function bindGeneralEvents() {
        document.addEventListener("cv:change", () => {
            const data = CVEditor.readForm();

            CVData.setData(data);
            CVPreview.render(data);

            scheduleSave();
        });
    }

    // --------------------------------
    // IMPORT EVENT
    // --------------------------------

    function bindImportEvents() {
        document.addEventListener("cv:import", event => {
            const importedData = CVData.normalize(event.detail);

            clearTimeout(saveTimer);

            CVData.setData(importedData);

            CVEditor.fillForm(importedData);
            CVPreview.render(importedData);

            const success = CVData.save();

            updateSaveStatus(
                success ? "CV imported successfully" : "Import save failed",
                success
            );
        });
    }

    // --------------------------------
    // RESET
    // --------------------------------

    function bindResetEvent() {
        $("#resetBtn")?.addEventListener("click", async () => {
            const confirmed = window.confirm(
                "Are you sure you want to reset this CV?"
            );

            if (!confirmed) return;

            clearTimeout(saveTimer);

            const mode = CVData.getMode();

            CVData.reset();

            if (mode === "personal") {
                try {
                    await loadPersonalMode();
                } catch (error) {
                    console.error("Reset profile error:", error);

                    CVData.setData(CVData.emptyCV);

                    const emptyData = CVData.getData();

                    CVEditor.fillForm(emptyData);
                    CVPreview.render(emptyData);

                    updateSaveStatus("Profile reset failed");
                }
            } else {
                CVData.setData(CVData.emptyCV);

                const emptyData = CVData.getData();

                CVEditor.fillForm(emptyData);
                CVPreview.render(emptyData);

                CVData.save();

                updateSaveStatus("Guest CV reset", true);
            }
        });
    }

    // --------------------------------
    // INITIALIZE
    // --------------------------------

    async function initialize() {
        updateSaveStatus("Initializing...");

        CVEditor.bindEvents();
        CVPreview.bindEvents();
        CVExport.bindEvents();

        bindNavigation();
        bindModeEvents();
        bindGeneralEvents();
        bindImportEvents();
        bindResetEvent();

        await loadPersonalMode();

        console.log(
            "ZIO CV Builder initialized successfully."
        );
    }

    initialize().catch(error => {
        console.error(
            "Application initialization failed:",
            error
        );

        updateSaveStatus("Application loading failed");
    });
});
