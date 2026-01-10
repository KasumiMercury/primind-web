import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
    calculateDimensions,
    OnboardingDemoShape,
} from "./onboarding-demo-shape";

interface TaskRegistrationOnboardingProps {
    className?: string;
}

const DEMO_WIDTH = 140;

// Animation timing constants (total cycle: 8 seconds)
const CYCLE_DURATION = 8;
const STEP1_START = 0;
const STEP1_DURATION = 2.5;
const STEP2_START = 3;
const STEP2_DURATION = 1.5;
const STEP3_START = 5;
const STEP3_DURATION = 1.5;

function TouchIndicator({ className }: { className?: string }) {
    return (
        <div
            className={`rounded-full bg-current shadow-lg ${className}`}
            aria-hidden="true"
        />
    );
}

function SwipeAnimation({ width }: { width: number }) {
    const dimensions = calculateDimensions(width);
    const { height, upperHeight, sideButtonWidth } = dimensions;

    const centerY = upperHeight + (height - upperHeight) / 2;
    const leftX = sideButtonWidth / 2;
    const centerX = width / 2;
    const rightX = width - sideButtonWidth / 2;

    return (
        <motion.div
            className="absolute text-primary"
            style={{
                top: centerY - 10,
                left: centerX - 10,
            }}
            animate={{
                x: [0, rightX - centerX, leftX - centerX, 0],
                opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
                duration: STEP1_DURATION,
                times: [0, 0.3, 0.7, 0.95, 1],
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: CYCLE_DURATION - STEP1_DURATION,
                delay: STEP1_START,
                ease: "easeInOut",
            }}
        >
            <TouchIndicator className="size-5" />
        </motion.div>
    );
}

function TapAnimation({ width }: { width: number }) {
    const dimensions = calculateDimensions(width);
    const { height, upperHeight } = dimensions;

    const centerY = upperHeight + (height - upperHeight) / 2;
    const centerX = width / 2;

    return (
        <>
            <motion.div
                className="absolute text-primary"
                style={{
                    top: centerY - 10,
                    left: centerX - 10,
                }}
                animate={{
                    scale: [0, 1, 1, 0.9, 1, 0],
                    opacity: [0, 1, 1, 1, 1, 0],
                }}
                transition={{
                    duration: STEP2_DURATION,
                    times: [0, 0.1, 0.4, 0.5, 0.6, 1],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: CYCLE_DURATION - STEP2_DURATION,
                    delay: STEP2_START,
                    ease: "easeInOut",
                }}
            >
                <TouchIndicator className="size-5" />
            </motion.div>
            <motion.div
                className="absolute rounded-full bg-primary/30"
                style={{
                    top: centerY - 20,
                    left: centerX - 20,
                    width: 40,
                    height: 40,
                }}
                animate={{
                    scale: [0, 1.5, 2],
                    opacity: [0.5, 0.3, 0],
                }}
                transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: CYCLE_DURATION - 0.8,
                    delay: STEP2_START + 0.4,
                    ease: "easeOut",
                }}
            />
        </>
    );
}

function SuccessAnimation({ width }: { width: number }) {
    const dimensions = calculateDimensions(width);
    const { height, upperHeight } = dimensions;

    const centerY = upperHeight + (height - upperHeight) / 2;
    const centerX = width / 2;

    return (
        <motion.div
            className="absolute flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600"
            style={{
                top: centerY - 20,
                left: centerX - 20,
                width: 40,
                height: 40,
            }}
            animate={{
                scale: [0, 1.1, 1, 1, 0],
                opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
                duration: STEP3_DURATION,
                times: [0, 0.3, 0.5, 0.8, 1],
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: CYCLE_DURATION - STEP3_DURATION,
                delay: STEP3_START,
                ease: "easeOut",
            }}
        >
            <motion.div
                animate={{
                    scale: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0],
                }}
                transition={{
                    duration: STEP3_DURATION,
                    times: [0, 0.3, 0.8, 1],
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: CYCLE_DURATION - STEP3_DURATION,
                    delay: STEP3_START + 0.2,
                    ease: "easeOut",
                }}
            >
                <Check className="size-6" strokeWidth={3} />
            </motion.div>
        </motion.div>
    );
}

interface OnboardingStepProps {
    number: number;
    title: string;
    description: string;
    children: React.ReactNode;
    width?: number;
}

function OnboardingStep({
    number,
    title,
    description,
    children,
    width = DEMO_WIDTH,
}: OnboardingStepProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative shrink-0" style={{ width }}>
                <OnboardingDemoShape width={width} radius={5}>
                    {children}
                </OnboardingDemoShape>
            </div>
            <div className="flex min-w-0 flex-1 items-start gap-2">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                    {number}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm">
                        {title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function TaskRegistrationOnboarding({
    className = "",
}: TaskRegistrationOnboardingProps) {
    const { t } = useTranslation();

    return (
        <div
            className={`flex flex-col items-center gap-4 rounded-xl bg-card px-4 py-6 shadow-sm ${className}`}
        >
            <div className="mx-auto flex w-fit flex-col gap-6">
                <OnboardingStep
                    number={1}
                    title={t("onboarding.step1Title")}
                    description={t("onboarding.step1Desc")}
                >
                    <SwipeAnimation width={DEMO_WIDTH} />
                </OnboardingStep>

                <hr className="border-primary/20 border-dashed" />

                <OnboardingStep
                    number={2}
                    title={t("onboarding.step2Title")}
                    description={t("onboarding.step2Desc")}
                >
                    <TapAnimation width={DEMO_WIDTH} />
                </OnboardingStep>

                <hr className="border-primary/20 border-dashed" />

                <OnboardingStep
                    number={3}
                    title={t("onboarding.step3Title")}
                    description={t("onboarding.step3Desc")}
                >
                    <SuccessAnimation width={DEMO_WIDTH} />
                </OnboardingStep>
            </div>
        </div>
    );
}
