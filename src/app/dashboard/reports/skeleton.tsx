import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReportsSkeleton() {
  return (
    <div className="flex flex-col items-center p-4 md:px-6">
      <div className="w-full max-w-6xl flex justify-between items-center mb-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-6">
        {/* Cards de Resumo Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-50">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full h-[300px] bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
