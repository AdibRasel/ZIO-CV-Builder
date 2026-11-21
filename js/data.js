
/**
 * ZIO CV Builder
 * Data Management
 */

window.CVData = (() => {
    const STORAGE_KEYS = {
        personal: "zio_cv_personal",
        guest: "zio_cv_guest"
    };

    const emptyCV = {
        personal: {
            fullName: "",
            jobTitle: "",
            email: "",
            phone: "",
            location: "",
            website: "",
            linkedin: "",
            github: "",
            profileImage: ""
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
        languages: [],
        certifications: [],
        settings: {
            template: "classic",
            accentColor: "violet",
            animation: "auto"
        }
    };

    let currentMode = "personal";
    let currentData = normalize(emptyCV);

    function normalize(data = {}) {
        const personal = data.personal || {};
        const settings = data.settings || {};

        return {
            personal: {
                ...emptyCV.personal,
                ...personal
            },

            summary: data.summary || "",

            experience: Array.isArray(data.experience)
                ? data.experience : [],

            education: Array.isArray(data.education)
                ? data.education : [],

            skills: Array.isArray(data.skills)
                ? data.skills : [],

            projects: Array.isArray(data.projects)
                ? data.projects : [],

            languages: Array.isArray(data.languages)
                ? data.languages : [],

            certifications: Array.isArray(data.certifications)
                ? data.certifications : [],

            settings: {
                ...emptyCV.settings,
                ...settings
            }
        };
    }

    function getStorageKey() {
        return STORAGE_KEYS[currentMode];
    }

    function setMode(mode) {
        if (mode === "personal" || mode === "guest") {
            currentMode = mode;
        }
    }

    function getMode() {
        return currentMode;
    }

    function setData(data) {
        currentData = normalize(data);
    }

    function getData() {
        return currentData;
    }

    function save() {
        try {
            localStorage.setItem(
                getStorageKey(),
                JSON.stringify(currentData)
            );

            return true;
        } catch (error) {
            console.error("CV save error:", error);
            return false;
        }
    }

    function loadSaved() {
        try {
            const saved = localStorage.getItem(getStorageKey());

            if (!saved) return false;

            currentData = normalize(JSON.parse(saved));

            return true;
        } catch (error) {
            console.error("CV loading error:", error);
            return false;
        }
    }

    function reset() {
        currentData = normalize(emptyCV);

        try {
            localStorage.removeItem(getStorageKey());
        } catch (error) {
            console.error("CV reset error:", error);
        }
    }

    function replace(data) {
        currentData = normalize(data);
        return save();
    }

    async function loadDefaultProfile() {
        const response = await fetch("./assets/data/profile.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Could not load profile.json. HTTP ${response.status}`
            );
        }

        const profile = await response.json();

        const converted = {
            personal: {
                fullName: profile.personal?.fullName || "",
                jobTitle: profile.personal?.jobTitle || "",
                email: profile.personal?.email || "",
                phone: profile.personal?.phone || "",
                location: profile.personal?.location || "",
                website:
                    profile.personal?.website ||
                    profile.personal?.portfolio || "",
                linkedin: profile.personal?.linkedin || "",
                github: profile.personal?.github || "",
                profileImage: profile.personal?.profileImage || ""
            },

            summary: profile.summary || "",

            experience: (profile.experience || []).map(item => ({
                position: item.position || "",
                company: item.company || "",
                location: item.location || "",
                startDate: item.startDate || "",
                endDate: item.endDate || "",
                current: item.current === true,
                description: item.description || ""
            })),

            education: (profile.education || []).map(item => ({
                qualification: item.qualification || "",
                institution: item.institution || "",
                location: item.location || "",
                startYear: item.startYear || item.year || "",
                endYear: item.endYear || "",
                result: [
                    item.group,
                    item.result
                ].filter(Boolean).join(" | ")
            })),

            skills: Array.isArray(profile.skills)
                ? profile.skills
                : Object.values(profile.skills || {}).flat(),

            projects: (profile.projects || []).map(item => ({
                name: item.name || "",
                url: item.url || "",
                description: item.description || ""
            })),

            languages: (profile.languages || []).map(item => ({
                name: item.name || "",
                level: item.level || ""
            })),

            certifications: (profile.certifications || []).map(item => {
                if (typeof item === "string") {
                    return {
                        name: item,
                        issuer: "",
                        date: "",
                        details: ""
                    };
                }

                return {
                    name: item.name || "",
                    issuer: item.issuer || "",
                    date: item.date || "",
                    details: item.details || ""
                };
            }),

            settings: {
                template: "classic",
                accentColor: "violet",
                animation: "auto"
            }
        };

        return normalize(converted);
    }

    return {
        emptyCV,
        normalize,
        loadDefaultProfile,
        setMode,
        getMode,
        setData,
        getData,
        save,
        loadSaved,
        reset,
        replace
    };
})();
