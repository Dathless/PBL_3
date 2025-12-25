import { useEffect, useState } from 'react'
import { payoutApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, XCircle, Clock, DollarSign, User, ExternalLink } from 'lucide-react'

export default function AdminPayouts() {
    const { toast } = useToast()
    const [payouts, setPayouts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const loadPayouts = async () => {
        try {
            setLoading(true)
            const data = await payoutApi.getAll()
            setPayouts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        } catch (error) {
            console.error('Failed to load payouts:', error)
            toast({
                title: "Error",
                description: "Could not load payout requests",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPayouts()
    }, [])

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            setProcessingId(id)
            await payoutApi.updateStatus(id, status)
            toast({
                title: status === 'COMPLETED' ? "Payout Approved" : "Payout Rejected",
                description: status === 'COMPLETED'
                    ? "The payout has been marked as completed."
                    : "The payout was rejected and funds were returned to the seller.",
                variant: status === 'COMPLETED' ? "default" : "destructive"
            })
            // Update local state
            setPayouts(prev => prev.map(p => p.id === id ? { ...p, status } : p))
        } catch (error) {
            console.error('Failed to update payout status:', error)
            toast({
                title: "Error",
                description: "Failed to update payout status",
                variant: "destructive"
            })
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> PENDING</span>
            case 'COMPLETED':
                return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> COMPLETED</span>
            case 'CANCELLED':
                return <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> REJECTED</span>
            default:
                return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold w-fit">{status}</span>
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Payout Management</h1>
                    <p className="text-slate-500 text-sm">Review and manage seller withdrawal requests</p>
                </div>
            </header>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Seller</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Request Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/50"></td>
                                    </tr>
                                ))
                            ) : payouts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <DollarSign className="w-12 h-12 opacity-10" />
                                            <p>No payout requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {payout.sellerName?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{payout.sellerName}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{payout.sellerId.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 text-sm">${payout.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-slate-600 font-medium px-2 py-1 bg-slate-100 rounded border border-slate-200 uppercase">
                                                {payout.method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-600">
                                                {new Date(payout.createdAt).toLocaleDateString()}
                                                <span className="block text-[10px] text-slate-400">{new Date(payout.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(payout.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {payout.status === 'PENDING' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(payout.id, 'COMPLETED')}
                                                        disabled={processingId === payout.id}
                                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors border border-transparent hover:border-emerald-100 group"
                                                        title="Approve Payout"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(payout.id, 'CANCELLED')}
                                                        disabled={processingId === payout.id}
                                                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                                        title="Reject Payout"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 text-slate-300">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{payout.status}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
