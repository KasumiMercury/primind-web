import { create } from "@bufbuild/protobuf";
import { createRouterTransport } from "@connectrpc/connect";
import {
    GetUserPeriodSettingsResponseSchema,
    PeriodSettingSchema,
    TaskType,
    UpdateUserPeriodSettingsResponseSchema,
    UserPeriodSettingsService,
} from "~/gen/task/v1/task_pb";

// In-memory mock storage
let mockSettings: { taskType: TaskType; periodMinutes: bigint }[] = [];

export function createPeriodSettingMockTransport() {
    return createRouterTransport(({ service }) => {
        service(UserPeriodSettingsService, {
            getUserPeriodSettings: () => {
                return create(GetUserPeriodSettingsResponseSchema, {
                    settings: mockSettings.map((s) =>
                        create(PeriodSettingSchema, {
                            taskType: s.taskType,
                            periodMinutes: s.periodMinutes,
                        }),
                    ),
                    defaults: [
                        create(PeriodSettingSchema, {
                            taskType: TaskType.SHORT,
                            periodMinutes: BigInt(30),
                        }),
                        create(PeriodSettingSchema, {
                            taskType: TaskType.NEAR,
                            periodMinutes: BigInt(180),
                        }),
                        create(PeriodSettingSchema, {
                            taskType: TaskType.RELAXED,
                            periodMinutes: BigInt(1440),
                        }),
                    ],
                });
            },
            updateUserPeriodSettings: (request) => {
                mockSettings = request.settings.map((s) => ({
                    taskType: s.taskType,
                    periodMinutes: s.periodMinutes,
                }));
                return create(UpdateUserPeriodSettingsResponseSchema, {
                    settings: request.settings,
                });
            },
        });
    });
}
