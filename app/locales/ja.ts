export default {
    // Task Types
    taskType: {
        short: "すぐ",
        near: "あとで",
        relaxed: "ゆっくり",
        scheduled: "スケジュール",
    },

    // Theme
    theme: {
        title: "テーマ",
        light: "ライト",
        dark: "ダーク",
        system: "システム",
    },

    // Language
    language: {
        title: "言語",
        en: "英語",
        ja: "日本語",
    },

    // Auth
    auth: {
        login: "ログイン",
        logout: "ログアウト",
        signingIn: "サインイン中...",
        signInWith: "{{provider}}でサインイン",
        error: "エラー",
    },

    // Common actions
    common: {
        edit: "Edit",
        confirm: "確認",
        cancel: "キャンセル",
        delete: "削除",
        deleting: "削除中...",
        save: "保存",
        saving: "保存中...",
        saved: "保存しました",
        failed: "失敗しました",
        notNow: "あとで",
        dontAskAgain: "今後表示しない",
        complete: "完了",
        completing: "完了処理中...",
        completed: "完了しました",
    },

    // Delete Task Dialog
    deleteTask: {
        title: "タスクを削除",
        description: "このタスクを削除してもよろしいですか？",
        error: "タスクの削除に失敗しました。もう一度お試しください。",
    },

    // Schedule Task Modal
    scheduleTask: {
        title: "タスクをスケジュール",
        date: "日付",
        time: "時間",
        quickAdd: "クイック追加",
        roundTo: "時刻を揃える",
        tooSoon:
            "スケジュール時間は現在時刻から{{minutes}}分以上先に設定してください",
    },

    // Notification Dialog
    notification: {
        enable: "通知を有効にする",
        enabling: "有効化中...",
        description: "リマインダー通知を受け取ります。",
    },

    // Task Detail
    taskDetail: {
        title: "タイトル",
        description: "説明",
        optionalLabel: "（オプション）",
        noTitle: "タイトルなし",
        noDescription: "説明なし",
        enterTitle: "タイトルを入力...",
        enterDescription: "説明を入力...",
        status: "ステータス",
        statusActive: "進行中",
        statusCompleted: "完了",
        statusUnknown: "不明",
        failedToComplete: "完了に失敗しました",
        created: "作成日時",
        targetTime: "目標時間",
        deleteTask: "タスクを削除",
    },

    // Quick Edit Modal
    quickEdit: {
        dialogTitle: "タスクが作成されました！",
        dialogDescription: "詳細を追加できます",
    },

    // Login Required Alert
    loginRequired: {
        title: "ログインが必要です",
        description: "すべての機能にアクセスするにはログインしてください",
    },

    // Error messages
    error: {
        oops: "エラーが発生しました",
        unexpected: "予期せぬエラーが発生しました。",
        notFound: "404",
        pageNotFound: "お探しのページは見つかりませんでした。",
        failedToLogout: "ログアウトに失敗しました。もう一度お試しください。",
        failedToLogin: "ログインの開始に失敗しました",
        authFailed: "認証に失敗しました",
    },
} as const;
