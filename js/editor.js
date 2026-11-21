
/**
 * ZIO CV Builder
 * Form Editor
 */

window.CVEditor = (() => {
    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const repeaters = {
        experience: {
            list: "#experienceList",
            button: "#addExperience",
            title: "Experience",
            fields: [
                ["position", "Job title", "text"],
                ["company", "Company", "text"],
                ["location", "Location", "text"],
                ["startDate", "Start date", "text"],
                ["endDate", "End date", "text"],
                ["description", "Job description", "textarea"]
            ]
        },

        education: {
            list: "#educationList",
            button: "#addEducation",
            title: "Education",
            fields: [
                ["qualification", "Degree / Qualification", "text"],
                ["institution", "Institution", "text"],
                ["location", "Location", "text"],
                ["startYear", "Start year", "text"],
                ["endYear", "End year", "text"],
                ["result", "Details (GPA, major, achievements)", "textarea"]
            ]
        },

        projects: {
            list: "#projectsList",
            button: "#addProject",
            title: "Project",
            fields: [
                ["name", "Project name", "text"],
                ["url", "Project link", "url"],
                ["description", "Description", "textarea"]
            ]
        },

        languages: {
            list: "#languagesList",
            button: "#addLanguage",
            title: "Language",
            fields: [
                ["name", "Language", "text"],
                ["level", "Proficiency", "select"]
            ]
        },

        certifications: {
            list: "#certificationsList",
            button: "#addCertification",
            title: "Certification / Award",
            fields: [
                ["name", "Title", "text"],
                ["issuer", "Issuing organization", "text"],
                ["date", "Year", "text"],
                ["details", "Details", "textarea"]
            ]
        }
    };

    function escapeHTML(value = "") {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function createField(key, label, type, value = "") {
        const safeValue = escapeHTML(value);
        const safeLabel = escapeHTML(label);

        if (type === "textarea") {
            return `
                <div class="form-group">
                    <label>${safeLabel}</label>
                    <textarea
                        data-field="${key}"
                        rows="3"
                        placeholder="${safeLabel}"
                    >${safeValue}</textarea>
                </div>
            `;
        }

        if (type === "select") {
            const levels = [
                "Native",
                "Fluent",
                "Advanced",
                "Intermediate",
                "Basic"
            ];

            return `
                <div class="form-group">
                    <label>${safeLabel}</label>
                    <select data-field="${key}">
                        <option value="">Select level</option>
                        ${levels.map(level => `
                            <option
                                value="${level}"
                                ${value === level ? "selected" : ""}
                            >
                                ${level}
                            </option>
                        `).join("")}
                    </select>
                </div>
            `;
        }

        return `
            <div class="form-group">
                <label>${safeLabel}</label>
                <input
                    type="${type}"
                    data-field="${key}"
                    value="${safeValue}"
                    placeholder="${safeLabel}"
                >
            </div>
        `;
    }

    function createCard(type, item = {}) {
        const config = repeaters[type];

        if (!config) return "";

        let fields = "";

        if (type === "experience") {
            fields = `
                <div class="form-row">
                    ${createField("position", "Job title", "text", item.position)}
                    ${createField("company", "Company", "text", item.company)}
                </div>

                ${createField("location", "Location", "text", item.location)}

                <div class="form-row">
                    ${createField("startDate", "Start date", "text", item.startDate)}
                    ${createField("endDate", "End date", "text", item.endDate)}
                </div>

                <label class="checkbox-label">
                    <input
                        type="checkbox"
                        data-field="current"
                        ${item.current ? "checked" : ""}
                    >
                    I currently work here
                </label>

                ${createField(
                    "description",
                    "Job description",
                    "textarea",
                    item.description
                )}
            `;
        } else {
            fields = config.fields.map(([key, label, fieldType]) =>
                createField(key, label, fieldType, item[key])
            ).join("");
        }

        return `
            <div class="repeatable-card" data-repeat-type="${type}">

                <div class="repeatable-header">
                    <strong>${config.title}</strong>

                    <button
                        type="button"
                        class="remove-item"
                        aria-label="Remove ${type}"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                ${fields}

            </div>
        `;
    }

    function renderRepeater(type, items = []) {
        const config = repeaters[type];
        if (!config) return;

        const container = $(config.list);
        if (!container) return;

        container.innerHTML = "";

        items.forEach(item => {
            container.insertAdjacentHTML(
                "beforeend",
                createCard(type, item)
            );
        });
    }

    function renderAll(data = {}) {
        Object.keys(repeaters).forEach(type => {
            renderRepeater(type, data[type] || []);
        });
    }

    function readRepeater(type) {
        const container = $(repeaters[type].list);
        if (!container) return [];

        return [...container.querySelectorAll(".repeatable-card")]
            .map(card => {
                const item = {};

                card.querySelectorAll("[data-field]").forEach(field => {
                    item[field.dataset.field] =
                        field.type === "checkbox"
                            ? field.checked
                            : field.value.trim();
                });

                return item;
            })
            .filter(item =>
                Object.values(item).some(value =>
                    value !== "" && value !== false
                )
            );
    }

    function readForm() {
        const data = CVData.normalize(CVData.getData());

        const personalFields = [
            "fullName",
            "jobTitle",
            "email",
            "phone",
            "location",
            "website",
            "linkedin",
            "github"
        ];

        personalFields.forEach(id => {
            const field = $("#" + id);

            if (field) {
                data.personal[id] = field.value.trim();
            }
        });

        const summary = $("#summaryText");
        if (summary) {
            data.summary = summary.value.trim();
        }

        const skills = $("#skillsText");
        if (skills) {
            data.skills = skills.value
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean);
        }

        Object.keys(repeaters).forEach(type => {
            data[type] = readRepeater(type);
        });

        const template = $("#templateSelect");
        const color = $("#accentColor");
        const animation = $("#animationToggle");

        if (template) {
            data.settings.template = template.value;
        }

        if (color) {
            data.settings.accentColor = color.value;
        }

        if (animation) {
            data.settings.animation = animation.value;
        }

        return data;
    }

    function fillForm(data = {}) {
        data = CVData.normalize(data);

        const personalFields = [
            "fullName",
            "jobTitle",
            "email",
            "phone",
            "location",
            "website",
            "linkedin",
            "github"
        ];

        personalFields.forEach(id => {
            const field = $("#" + id);

            if (field) {
                field.value = data.personal[id] || "";
            }
        });

        const summary = $("#summaryText");
        if (summary) {
            summary.value = data.summary || "";
        }

        const skills = $("#skillsText");
        if (skills) {
            skills.value = data.skills.join(", ");
        }

        if ($("#templateSelect")) {
            $("#templateSelect").value =
                data.settings.template || "classic";
        }

        if ($("#accentColor")) {
            $("#accentColor").value =
                data.settings.accentColor || "violet";
        }

        if ($("#animationToggle")) {
            const animation = data.settings.animation;

            $("#animationToggle").value =
                animation === true ? "on" :
                animation === false ? "off" :
                animation || "auto";
        }

        renderAll(data);

        const image = $("#previewImage");
        const wrapper = $("#previewImageWrapper");

        if (image) {
            image.src = data.personal.profileImage || "";
            image.hidden = !data.personal.profileImage;
        }

        if (wrapper) {
            wrapper.hidden = !data.personal.profileImage;
        }
    }

    function addEntry(type) {
        const config = repeaters[type];
        if (!config) return;

        const container = $(config.list);
        if (!container) return;

        container.insertAdjacentHTML(
            "beforeend",
            createCard(type)
        );

        document.dispatchEvent(new Event("cv:change"));
    }

    function removeEntry(button) {
        button.closest(".repeatable-card")?.remove();

        document.dispatchEvent(new Event("cv:change"));
    }

    function handleProfileImage(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image size must be less than 2 MB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const data = CVData.getData();

            data.personal.profileImage = reader.result;

            CVData.setData(data);

            document.dispatchEvent(new Event("cv:change"));
        };

        reader.onerror = () => {
            alert("Could not read the selected image.");
        };

        reader.readAsDataURL(file);
    }

    function bindEvents() {
        Object.entries(repeaters).forEach(([type, config]) => {
            $(config.button)?.addEventListener("click", () => {
                addEntry(type);
            });
        });

        document.addEventListener("click", event => {
            const button = event.target.closest(".remove-item");

            if (button) {
                removeEntry(button);
            }
        });

        // Live input updates
        document.addEventListener("input", event => {
            if (event.target.matches(
                "input:not([type='file']), textarea"
            )) {
                document.dispatchEvent(new Event("cv:change"));
            }
        });

        document.addEventListener("change", event => {
            if (event.target.matches("select, input[type='checkbox']")) {
                document.dispatchEvent(new Event("cv:change"));
            }
        });

        $("#profileImage")?.addEventListener(
            "change",
            handleProfileImage
        );
    }

    return {
        fillForm,
        readForm,
        renderAll,
        renderRepeater,
        addEntry,
        bindEvents
    };
})();
