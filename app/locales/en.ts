export default {
    // Task Types
    taskType: {
        short: "Soon",
        near: "Later",
        relaxed: "No rush",
        scheduled: "Schedule",
    },

    // Theme
    theme: {
        title: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
    },

    // Language
    language: {
        title: "Language",
        en: "English",
        ja: "Japanese",
    },

    // Auth
    auth: {
        login: "Login",
        logout: "Logout",
        signingIn: "Signing in...",
        signInWith: "Sign in with {{provider}}",
        error: "Error",
    },

    // Common actions
    common: {
        edit: "Edit",
        confirm: "Confirm",
        cancel: "Cancel",
        delete: "Delete",
        deleting: "Deleting...",
        save: "Save",
        saving: "Saving...",
        saved: "Saved",
        failed: "Failed",
        notNow: "Not now",
        dontAskAgain: "Don't ask again",
        complete: "Complete",
        completing: "Completing...",
        completed: "Completed",
    },

    // Delete Task Dialog
    deleteTask: {
        title: "Delete Task",
        description: "Are you sure you want to delete this task?",
        error: "Failed to delete this task. Please try again.",
    },

    // Schedule Task Modal
    scheduleTask: {
        title: "Schedule Task",
        date: "Date",
        time: "Time",
        quickAdd: "Quick add",
        roundTo: "Round to",
        tooSoon: "Schedule time must be at least {{minutes}} minutes from now",
    },

    // Notification Dialog
    notification: {
        enable: "Enable Notifications",
        enabling: "Enabling...",
        description: "Enable notifications to remind you.",
    },

    // Task Detail
    taskDetail: {
        title: "Title",
        description: "Description",
        optionalLabel: "(Optional)",
        noTitle: "No title",
        noDescription: "No description",
        enterTitle: "Enter title...",
        enterDescription: "Enter description...",
        status: "Status",
        statusActive: "Active",
        statusCompleted: "Completed",
        statusUnknown: "Unknown",
        failedToComplete: "Failed to complete",
        created: "Created",
        targetTime: "Target Time",
        deleteTask: "Delete Task",
    },

    // Quick Edit Modal
    quickEdit: {
        dialogTitle: "Task Created!",
        dialogDescription: "Add optional details to your task",
    },

    // Login Required Alert
    loginRequired: {
        title: "Login Required",
        description: "Please log in to access all features",
    },

    // Title Presets
    titlePresets: {
        label: "Quick fill",
        shopping: "Shopping",
        callback: "Call back",
        laundry: "Take in laundry",
    },

    // Voice Input
    voiceInput: {
        label: "Voice input",
        labelListening: "Listening...",
        startListening: "Start voice input",
        stopListening: "Stop voice input",
        listening: "Listening...",
        revert: "Undo",
        errorNoSpeech: "No speech detected",
        errorAudioCapture: "No microphone found",
        errorNotAllowed: "Microphone access denied",
        errorNetwork: "Network error",
        errorGeneric: "Voice input error",
    },

    // Error messages
    error: {
        oops: "Oops!",
        unexpected: "An unexpected error occurred.",
        notFound: "404",
        pageNotFound: "The requested page could not be found.",
        failedToLogout: "Failed to log out. Please try again.",
        failedToLogin: "Failed to initiate login",
        authFailed: "Authentication Failed",
    },
} as const;
