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
        loggingIn: "Logging in...",
        loginWith: "Log in with {{provider}}",
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
        retry: "Retry",
    },

    // Delete Task Dialog
    deleteTask: {
        title: "Delete Task",
        description: "Are you sure you want to delete this task?",
        error: "Failed to delete this task. Please try again.",
    },

    // Recreate Task Dialog
    recreateTask: {
        button: "Recreate",
        dialogTitle: "Recreate Task",
        selectType: "Select new task type",
        currentType: "Current type",
        confirmTitle: "Confirm Recreation",
        confirmDescription:
            "The task will be recreated with the following details:",
        newType: "New Task Type",
        scheduledTime: "Scheduled Time",
        recreating: "Recreating...",
        success: "Task recreated successfully",
        errorCreate: "Failed to create new task",
        errorGeneric: "Failed to recreate task",
        confirm: "Recreate",
        back: "Back",
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

    // Session Invalid Dialog
    session: {
        invalid: {
            title: "Logged Out",
            description: "You have been logged out. Please log in again.",
            goHome: "Go to Home",
        },
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

    // Local Task Warning
    localTask: {
        reminder: {
            title: "Reminder Notifications Unavailable",
            description:
                "Sign in to receive reminder notifications for your tasks.",
        },
    },

    // Title Presets
    titlePresets: {
        label: "Quick fill",
        shopping: "Shopping",
        callback: "Call back",
        laundry: "Take in laundry",
    },

    // Relative Time
    relativeTime: {
        now: "now",
    },

    // Onboarding
    onboarding: {
        step1Title: "Choose type",
        step1Desc: "Swipe left/right or tap edges",
        step2Title: "Create remind",
        step2Desc: "Tap the center",
        step3Title: "Done!",
        step3Desc: "Your remind is created",
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

    // Legacy error messages (kept for backward compatibility during migration)
    error: {
        oops: "Oops!",
        unexpected: "An unexpected error occurred.",
        notFound: "404",
        pageNotFound: "The requested page could not be found.",
        failedToLogout: "Failed to log out. Please try again.",
        failedToLogin: "Failed to initiate login",
        authFailed: "Authentication Failed",
        unsupportedBrowser: {
            title: "Browser Not Supported",
            description:
                "This browser is not supported. Please try using a different browser.",
        },
    },

    errors: {
        "task.create.failed": "Failed to create task. Please try again.",
        "task.get.failed": "Failed to load task details.",
        "task.update.failed": "Failed to update task. Please try again.",
        "task.delete.failed": "Failed to delete task. Please try again.",
        "task.list.failed": "Failed to load tasks.",
        "task.complete.failed": "Failed to complete task. Please try again.",
        "task.notFound": "Task not found.",

        "auth.session.invalid":
            "Your session has expired. Please log in again.",
        "auth.login.failed": "Failed to log in. Please try again.",
        "auth.logout.failed": "Failed to log out. Please try again.",

        "device.register.failed":
            "Failed to enable notifications. Please try again.",
        "device.storage.unavailable": "Local storage is not available.",

        "common.unexpected": "An unexpected error occurred. Please try again.",
        "common.networkError": "Network error. Please check your connection.",
    },
} as const;
