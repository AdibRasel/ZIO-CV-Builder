
/**
 * ZIO CV Builder
 * Live Resume Preview
 */

window.CVPreview = (() => {
    const $ = selector => document.querySelector(selector);

    const templates = [
        "template-classic",
        "template-modern",
        "template-minimal",
        "template-creative",
        "template-professional"
    ];

    const accents = [
        "accent-violet",
        "accent-teal",
        "accent-blue",
        "accent-terracotta",
        "accent-charcoal"
    ];

    // Escape HTML to prevent unwanted HTML injection
    function escapeHTML(value = "") {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function asArray(value) {
        return Array.isArray(value) ? value : [];
    }

    // Date formatter
    function getDate(start, end, current = false) {
        const first = escapeHTML(start);
        const last = current ? "Present" : escapeHTML(end);

        if (!first && !last) return "";
        if (!first) return last;
        if (!last) return first;

        return `${first} – ${last}`;
    }

    // Experience
    function renderExperience(items = []) {
        return asArray(items).map(item => `
            <div class="resume-entry">
                <div class="resume-entry-header">
                    <h4>${escapeHTML(item.position || item.jobTitle || item.title)}</h4>

                    <span class="resume-entry-date">
                        ${getDate(item.startDate, item.endDate, item.current)}
                    </span>
                </div>

                <div class="resume-entry-subtitle">
                    ${escapeHTML(item.company || item.organization)}
                    ${item.location ? " · " + escapeHTML(item.location) : ""}
                </div>

                ${item.description
                    ? `<p class="resume-entry-description">${escapeHTML(item.description)}</p>`
                    : ""}
            </div>
        `).join("");
    }

    // Education
    function renderEducation(items = []) {
        return asArray(items).map(item => {
            const qualification =
                item.qualification ||
                item.degree ||
                item.group ||
                item.title ||
                "";

            const institution =
                item.institution ||
                item.school ||
                item.college ||
                "";

            const result =
                item.result ||
                item.gpa ||
                "";

            return `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <h4>${escapeHTML(qualification)}</h4>

                        <span class="resume-entry-date">
                            ${getDate(item.startYear || item.startDate, item.endYear || item.endDate)}
                        </span>
                    </div>

                    <div class="resume-entry-subtitle">
                        ${escapeHTML(institution)}
                        ${item.location ? " · " + escapeHTML(item.location) : ""}
                    </div>

                    ${result
                        ? `<p class="resume-entry-description">${escapeHTML(result)}</p>`
                        : ""}
                </div>
            `;
        }).join("");
    }

    // Skills
    function renderSkills(items = []) {
        return asArray(items).map(skill => {
            const name = typeof skill === "string"
                ? skill
                : skill.name || skill.title || "";

            return name
                ? `<span class="skill-tag">${escapeHTML(name)}</span>`
                : "";
        }).join("");
    }

    // Projects
    function renderProjects(items = []) {
        return asArray(items).map(item => `
            <div class="resume-entry">
                <div class="resume-entry-header">
                    <h4>${escapeHTML(item.name || item.title)}</h4>
                </div>

                ${item.url
                    ? `<p><a href="${escapeHTML(item.url)}">${escapeHTML(item.url)}</a></p>`
                    : ""}

                ${item.description
                    ? `<p class="resume-entry-description">${escapeHTML(item.description)}</p>`
                    : ""}
            </div>
        `).join("");
    }

    // Languages
    function renderLanguages(items = []) {
        return asArray(items).map(item => {
            const name = typeof item === "string"
                ? item
                : item.name || "";

            const level = typeof item === "string"
                ? ""
                : item.level || item.proficiency || "";

            return `
                <div class="language-item">
                    <strong>${escapeHTML(name)}</strong>
                    ${level ? `<span>${escapeHTML(level)}</span>` : ""}
                </div>
            `;
        }).join("");
    }

    // Certifications
    function renderCertifications(items = []) {
        return asArray(items).map(item => {
            const certification = typeof item === "string"
                ? { name: item }
                : item;

            return `
                <div class="resume-entry">
                    <div class="resume-entry-header">
                        <h4>${escapeHTML(certification.name || certification.title)}</h4>

                        ${certification.date
                            ? `<span class="resume-entry-date">${escapeHTML(certification.date)}</span>`
                            : ""}
                    </div>

                    ${certification.issuer
                        ? `<div class="resume-entry-subtitle">${escapeHTML(certification.issuer)}</div>`
                        : ""}

                    ${certification.details
                        ? `<p class="resume-entry-description">${escapeHTML(certification.details)}</p>`
                        : ""}
                </div>
            `;
        }).join("");
    }

    // Set text content
    function setText(id, value) {
        const element = $("#" + id);

        if (element) {
            element.textContent = value || "";
        }
    }

    // Set HTML content
    function setHTML(id, value) {
        const element = $("#" + id);

        if (element) {
            element.innerHTML = value || "";
        }
    }

    // Show / Hide sections
    function toggleSection(sectionId, contentId, content) {
        const section = $("#" + sectionId);
        const target = $("#" + contentId);

        if (target) {
            target.innerHTML = content || "";
        }

        if (section) {
            section.hidden = !content || !content.trim();
        }
    }

    // Contact Information with Icons
    function renderContact(person) {
        const contact = [
            {
                icon: "fa-solid fa-envelope",
                value: person.email
            },
            {
                icon: "fa-solid fa-phone",
                value: person.phone
            },
            {
                icon: "fa-solid fa-location-dot",
                value: person.location
            }
        ].filter(item => item.value);

        setHTML(
            "previewContact",
            contact.map(item => `
                <span class="resume-contact-item">
                    <i class="${item.icon}" aria-hidden="true"></i>
                    <span>${escapeHTML(item.value)}</span>
                </span>
            `).join("")
        );
    }

    // Portfolio & Social Links with Icons
    function renderLinks(person) {
        const links = [
            {
                icon: "fa-solid fa-globe",
                value: person.website || person.portfolio
            },
            {
                icon: "fa-brands fa-linkedin",
                value: person.linkedin
            },
            {
                icon: "fa-brands fa-github",
                value: person.github
            }
        ].filter(item => item.value);

        setHTML(
            "previewLinks",
            links.map(item => `
                <span class="resume-link-item">
                    <i class="${item.icon}" aria-hidden="true"></i>
                    <span>${escapeHTML(item.value)}</span>
                </span>
            `).join("")
        );
    }

    // Profile Image
    function renderImage(person) {
        const image = $("#previewImage");
        const wrapper = $("#previewImageWrapper");

        if (!image || !wrapper) return;

        const source = person.profileImage || "";

        image.hidden = !source;
        wrapper.hidden = !source;

        if (source) {
            image.src = source;
        } else {
            image.removeAttribute("src");
        }
    }

    // Apply Template, Accent Color & Animation
    function applySettings(data) {
        const preview = $("#resumePreview");

        if (!preview) return;

        const settings = data.settings || {};

        const templateSelect = $("#templateSelect");
        const accentSelect = $("#accentColor");
        const animationSelect = $("#animationToggle");

        const template = settings.template || "classic";
        const accent = settings.accentColor || "violet";
        const animation = settings.animation ?? "on";

        const safeTemplate = templates.includes(`template-${template}`)
            ? template
            : "classic";

        const safeAccent = accents.includes(`accent-${accent}`)
            ? accent
            : "violet";

        const animationEnabled =
            animation === true ||
            animation === "on" ||
            animation === "auto";

        preview.classList.remove(...templates, ...accents);

        preview.classList.add(`template-${safeTemplate}`);
        preview.classList.add(`accent-${safeAccent}`);

        preview.classList.toggle(
            "animation-enabled",
            animationEnabled
        );

        preview.classList.toggle(
            "no-animation",
            !animationEnabled
        );

        if (templateSelect) {
            templateSelect.value = safeTemplate;
        }

        if (accentSelect) {
            accentSelect.value = safeAccent;
        }

        if (animationSelect) {
            animationSelect.value = animationEnabled ? "on" : "off";
        }
    }

    // Main Render Function
    function render(data = CVData.getData()) {
        if (!data) return;

        const person = data.personal || {};

        // Personal Information
        setText(
            "previewName",
            person.fullName || "Your Name"
        );

        setText(
            "previewJobTitle",
            person.jobTitle || "Professional Title"
        );

        renderContact(person);
        renderLinks(person);
        renderImage(person);

        // Summary
        const summary = data.summary || "";

        setText(
            "previewSummary",
            summary
        );

        const summarySection = $("#previewSummarySection");

        if (summarySection) {
            summarySection.hidden = !summary.trim();
        }

        // Experience
        toggleSection(
            "previewExperienceSection",
            "previewExperience",
            renderExperience(data.experience)
        );

        // Education
        toggleSection(
            "previewEducationSection",
            "previewEducation",
            renderEducation(data.education)
        );

        // Skills
        toggleSection(
            "previewSkillsSection",
            "previewSkills",
            renderSkills(data.skills)
        );

        // Projects
        toggleSection(
            "previewProjectsSection",
            "previewProjects",
            renderProjects(data.projects)
        );

        // Languages
        toggleSection(
            "previewLanguagesSection",
            "previewLanguages",
            renderLanguages(data.languages)
        );

        // Certifications
        toggleSection(
            "previewCertificationsSection",
            "previewCertifications",
            renderCertifications(data.certifications)
        );

        // Apply Settings
        applySettings(data);
    }

    // Bind Events
    function bindEvents() {
        [
            "templateSelect",
            "accentColor",
            "animationToggle"
        ].forEach(id => {
            $("#" + id)?.addEventListener("change", () => {
                document.dispatchEvent(new Event("cv:change"));
            });
        });
    }

    return {
        render,
        bindEvents
    };
})();
