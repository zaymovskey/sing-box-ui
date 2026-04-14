import { Activity, RefreshCcw } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui";

import { DiagnosticCard } from "./DiagnosticCard";

export function InboundDetailsDiagnosticsSection() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>Диагностика</CardTitle>
              <CardDescription>
                Черновой вид секции с базовыми проверками инбаунда.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button disabled type="button" variant="outline">
                <RefreshCcw />
                Проверить заново
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <div className="grid gap-4 xl:grid-cols-3">
            <DiagnosticCard
              actionLabel="Запустить check"
              description="Проверяет, что нужный порт реально слушается на хосте и доступен для входящих подключений."
              details={[
                "ss показал LISTEN на 0.0.0.0:443",
                "Проверено только как демо-верстка",
              ]}
              icon={<Activity className="size-4" />}
              message="Порт слушается и доступен на всех интерфейсах."
              status="pass"
              subtitle="Проверено 20 секунд назад"
              title="Port listening"
            />

            <DiagnosticCard
              isLoading
              actionLabel="Запустить check"
              description="Проверка bind-address в процессе, поэтому пока показываем мягкий loading-state без дерганья layout."
              details={["", ""]}
              icon={<Activity className="size-4" />}
              message=""
              status="unknown"
              subtitle=""
              title="Bind address"
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
