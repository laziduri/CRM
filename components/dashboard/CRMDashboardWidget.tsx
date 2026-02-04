'use client'

import Link from 'next/link'
import { ChevronRight, FolderKanban, Plus, Users } from 'lucide-react'

interface DealStatusItem {
  status: string
  count: number
  color: string
}

interface CRMDashboardWidgetProps {
  pendingApplications?: number
  activeClients?: number
  dealStatusData?: DealStatusItem[]
  onAddClient?: () => void
}

function getPipelineSummary(dealStatusData: DealStatusItem[]) {
  const inProgress = dealStatusData.filter((d) =>
    ['New', 'In Progress', 'Under Review', 'Appointment'].includes(d.status)
  )
  return inProgress.reduce((sum, d) => sum + d.count, 0)
}

export default function CRMDashboardWidget({
  pendingApplications = 0,
  activeClients = 0,
  dealStatusData = [],
  onAddClient,
}: CRMDashboardWidgetProps) {
  const pipelineActive = getPipelineSummary(dealStatusData)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderKanban className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">CRM Quick View</h2>
              <p className="text-xs text-gray-500">Pipeline & clients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-3">
        {/* Pipeline snapshot */}
        <Link
          href="/consultant/pipeline"
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <FolderKanban className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-gray-900 text-sm">Pipeline</p>
              <p className="text-xs text-gray-500">
                {pipelineActive > 0 ? `${pipelineActive} active` : 'View deals'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>

        {/* Clients */}
        <Link
          href="/consultant/clients"
          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-gray-900 text-sm">Clients</p>
              <p className="text-xs text-gray-500">
                {activeClients > 0 ? `${activeClients} active` : 'View clients'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </Link>

        {/* Add Client CTA */}
        {onAddClient && (
          <button
            type="button"
            onClick={onAddClient}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors min-h-[44px] font-medium text-sm"
          >
            <Plus className="w-5 h-5" />
            Add Client
          </button>
        )}
      </div>
    </div>
  )
}
