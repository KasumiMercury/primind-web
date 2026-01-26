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

    // Menu
    menu: {
        open: "メニューを開く",
        close: "メニューを閉じる",
        title: "メニュー",
        notification: "通知",
        notificationDescription: "プッシュ通知を有効にする",
    },

    // Auth
    auth: {
        login: "ログイン",
        logout: "ログアウト",
        loggingIn: "ログイン中...",
        loginWith: "{{provider}}でログイン",
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
        skip: "スキップ",
        complete: "完了",
        completing: "完了処理中...",
        completed: "完了しました",
        retry: "リトライ",
    },

    // Delete Task Dialog
    deleteTask: {
        title: "タスクを削除",
        description: "このタスクを削除してもよろしいですか？",
        error: "タスクの削除に失敗しました。もう一度お試しください。",
    },

    // Recreate Task Dialog
    recreateTask: {
        button: "作り直し",
        dialogTitle: "タスクを作り直す",
        selectType: "新しいタスクタイプを選択",
        currentType: "現在のタイプ",
        confirmTitle: "作り直しの確認",
        confirmDescription: "以下の内容でタスクを作り直します：",
        newType: "新しいタスクタイプ",
        scheduledTime: "予定日時",
        recreating: "作り直し中...",
        success: "タスクを作り直しました",
        errorCreate: "新しいタスクの作成に失敗しました",
        errorGeneric: "タスクの作り直しに失敗しました",
        confirm: "作り直す",
        back: "戻る",
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

    // Notification Setup Dialog
    notificationSetup: {
        intro: {
            title: "通知を有効にする",
            description: "リマインダー通知を受け取ります。",
            enable: "有効にする",
        },
        pwa: {
            title: "アプリをインストール",
            descriptionRequired:
                "iOSで通知を受け取るには、PriMindをホーム画面にインストールする必要があります。",
            descriptionRecommended:
                "PriMindをインストールして、最高の体験を。ホーム画面からすぐにアクセスでき、通知も受け取れます。",
            installButton: "アプリをインストール",
            installing: "インストール中...",
            iosInstalled: "インストールしました",
            iosInstructions: {
                title: "インストール方法：",
                step1: "Safariの共有ボタンをタップ",
                step2: "「ホーム画面に追加」をタップ",
                step3: "「追加」をタップして確認",
            },
        },
        permission: {
            title: "通知を許可する",
            description:
                "リマインダーを受け取るには、ブラウザで通知を許可してください。",
            allow: "許可する",
            allowing: "許可中...",
        },
    },

    // Session Invalid Dialog
    session: {
        invalid: {
            title: "ログアウトしました",
            description: "ログアウトしました。再度ログインしてください。",
            goHome: "ホームへ戻る",
        },
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

    // Local Task Warning
    localTask: {
        reminder: {
            title: "リマインド通知が利用できません",
            description:
                "タスクのリマインド通知を受け取るにはログインしてください。",
        },
    },

    // Title Presets
    titlePresets: {
        label: "クイック入力",
        shopping: "買い物",
        callback: "折り返し",
        laundry: "洗濯物取り込み",
    },

    // Relative Time
    relativeTime: {
        now: "now",
    },

    // Onboarding
    onboarding: {
        step1Title: "タイプを選択",
        step1Desc: "左右にスワイプ、または端をタップ",
        step2Title: "リマインドを作成",
        step2Desc: "中央をタップ",
        step3Title: "完了！",
        step3Desc: "リマインドが作成されました",
    },

    // Voice Input
    voiceInput: {
        label: "音声入力",
        labelListening: "聞き取り中...",
        startListening: "音声入力を開始",
        stopListening: "音声入力を停止",
        listening: "聞き取り中...",
        revert: "元に戻す",
        errorNoSpeech: "音声が検出されませんでした",
        errorAudioCapture: "マイクが見つかりません",
        errorNotAllowed: "マイクへのアクセスが拒否されました",
        errorNetwork: "ネットワークエラー",
        errorGeneric: "音声入力エラー",
    },

    // Legacy error messages (kept for backward compatibility during migration)
    error: {
        oops: "エラーが発生しました",
        unexpected: "予期せぬエラーが発生しました。",
        notFound: "404",
        pageNotFound: "お探しのページは見つかりませんでした。",
        goHome: "トップに戻る",
        failedToLogout: "ログアウトに失敗しました。もう一度お試しください。",
        failedToLogin: "ログインの開始に失敗しました",
        authFailed: "認証に失敗しました",
        unsupportedBrowser: {
            title: "非対応のブラウザ",
            description:
                "このブラウザには対応しておりません。別のブラウザをお試しください。",
        },
        taskNotFound: {
            title: "タスクが見つかりません",
            subtitle: "以下の理由が考えられます：",
            reasons: {
                completed: "タスクがすでに完了済み",
                deleted: "タスクが削除された",
            },
            loginPrompt: {
                title: "ログイン時に作成したタスクをお探しですか？",
                description: "ログインすると同期済みのタスクを表示できます。",
            },
        },
    },

    errors: {
        "task.create.failed":
            "タスクの作成に失敗しました。もう一度お試しください。",
        "task.get.failed": "タスクの読み込みに失敗しました。",
        "task.update.failed":
            "タスクの更新に失敗しました。もう一度お試しください。",
        "task.delete.failed":
            "タスクの削除に失敗しました。もう一度お試しください。",
        "task.list.failed": "タスク一覧の読み込みに失敗しました。",
        "task.complete.failed":
            "タスクの完了に失敗しました。もう一度お試しください。",
        "task.notFound": "タスクが見つかりません。",

        "auth.session.invalid":
            "セッションが期限切れです。再度ログインしてください。",
        "auth.login.failed": "ログインに失敗しました。もう一度お試しください。",
        "auth.logout.failed":
            "ログアウトに失敗しました。もう一度お試しください。",

        "device.register.failed":
            "通知の有効化に失敗しました。もう一度お試しください。",
        "device.storage.unavailable": "ローカルストレージが利用できません。",

        "common.unexpected":
            "予期せぬエラーが発生しました。もう一度お試しください。",
        "common.networkError":
            "ネットワークエラーです。接続を確認してください。",
    },
} as const;
