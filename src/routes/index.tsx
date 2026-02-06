import { createFileRoute, Link } from '@tanstack/react-router'
import { PieChartLg } from '@/components/Progress';
import { getProgressStats } from '@/lib/answers';
import { GoToQuestion } from '@/components/question/GoToQuestion';

export const Route = createFileRoute('/')({
  component: App,
  loader: () => getProgressStats(), // This will load the progress stats when the route is accessed
})

function App() {
  const progressStats = Route.useLoaderData() // This will give us access to the loaded progress stats

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
        <div className="flex">
          <div className="flex-1 p-8 lg:p-12">
            <div className="max-w-2xl mx-auto mb-12 p-8 bg-white rounded shadow">
              <PieChartLg data={progressStats} />
            </div>

            <div className="max-w-4xl mx-auto space-y-12 flex flex-col items-center">
              <Link to="/pages/30questions">
                <div className="hover:underline cursor-pointer text-utility-brand-600 h-12 w-32 border border-utility-brand-600 rounded flex items-center justify-center max-w-full">30 Questions</div>
              </Link>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 flex flex-col items-center">
              <GoToQuestion/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
