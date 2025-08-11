
'use client';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use } from 'react';

export default function TodoDetail({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const searchParams = useSearchParams();
    const id = unwrappedParams.id;
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const text = searchParams.get('text');
    const diffDays = searchParams.get('diffDays');
    const dueDate = searchParams.get('dueDate');

    // 優先級顏色映射
    const getPriorityColor = (priority: string | null) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // 計算剩餘天數的顏色
    const getDaysColor = (days: string | null) => {
        const daysNum = parseInt(days || '0');
        if (daysNum < 0) return 'text-red-600 font-semibold';
        if (daysNum <= 3) return 'text-orange-600 font-semibold';
        if (daysNum <= 7) return 'text-yellow-600 font-semibold';
        return 'text-green-600';
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* 標題區域 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        📋 Todo 詳細資訊
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {/* 主要內容卡片 */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* 卡片標頭 */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                        <h2 className="text-white text-xl font-semibold flex items-center">
                            <span className="mr-2">🎯</span>
                            Todo #{id}
                        </h2>
                    </div>

                    {/* 內容區域 */}
                    <div className="p-6 space-y-6">
                        {/* 任務內容 */}
                        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">📝 任務內容</h3>
                            <p className="text-lg text-gray-800 font-medium">
                                {text || '未提供任務描述'}
                            </p>
                        </div>

                        {/* 資訊網格 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 分類 */}
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">🏷️</span>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">分類</h4>
                                        <p className="text-lg font-semibold text-indigo-700">
                                            {category || '未分類'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 優先級 */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">⭐</span>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">優先級</h4>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(priority)}`}>
                                            {priority || '未設定'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 到期日 */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">📅</span>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">到期日</h4>
                                        <p className="text-lg font-semibold text-green-700">
                                            {dueDate || '未設定'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 剩餘天數 */}
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">⏰</span>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">剩餘時間</h4>
                                        <p className={`text-lg font-bold ${getDaysColor(diffDays)}`}>
                                            {diffDays ? (
                                                parseInt(diffDays) < 0 
                                                    ? `已逾期 ${Math.abs(parseInt(diffDays))} 天`
                                                    : parseInt(diffDays) === 0 
                                                    ? '今天到期！'
                                                    : `還有 ${diffDays} 天`
                                            ) : '未設定'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 底部操作區 */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                        <div className="flex justify-center">
                            <Link href="/test2">
                                <button className="group flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                                    <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-300">←</span>
                                    返回列表
                                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">🏠</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 裝飾性元素 */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
                        <span>✨</span>
                        <span>Todo 管理系統</span>
                        <span>✨</span>
                    </div>
                </div>
            </div>
        </main>
    );
}