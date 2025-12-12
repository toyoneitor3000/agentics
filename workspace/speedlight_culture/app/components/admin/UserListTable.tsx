'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Shield, Medal, Calendar, Search } from 'lucide-react';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    username: string;
    avatar_url: string;
    role: string;
    founder_number: number;
    xp: number;
    level: number;
    created_at: string;
}

export default function UserListTable({ users }: { users: Profile[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof Profile>('founder_number');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Filter
    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';

        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        return sortDirection === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });

    const handleSort = (field: keyof Profile) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div className="bg-[#0F0A08] border border-white/5 rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.02]">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-[#FF9800] outline-none"
                    />
                </div>
                <div className="text-xs text-white/40 font-mono">
                    Total: <span className="text-white font-bold">{filteredUsers.length}</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-black/40 text-[10px] uppercase tracking-widest text-white/50 font-bold border-b border-white/5">
                            <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('full_name')}>Usuario</th>
                            <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('role')}>Rol</th>
                            <th className="p-4 cursor-pointer hover:text-white text-center" onClick={() => handleSort('founder_number')}>Founder #</th>
                            <th className="p-4 cursor-pointer hover:text-white text-center" onClick={() => handleSort('xp')}>XP / Level</th>
                            <th className="p-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('created_at')}>Unido</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border border-white/10 bg-[#1a1a1a] overflow-hidden shrink-0 relative">
                                            {user.avatar_url ? (
                                                <Image src={user.avatar_url} alt={user.full_name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20"><User className="w-5 h-5" /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{user.full_name || 'Sin Nombre'}</p>
                                            <p className="text-xs text-white/40">{user.email || 'No Email'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${user.role === 'CEO'
                                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            : 'bg-white/5 text-white/40 border-white/10'
                                        }`}>
                                        {user.role === 'CEO' && <Shield className="w-3 h-3" />}
                                        {user.role || 'Member'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    {user.founder_number ? (
                                        <span className={`font-mono text-sm ${user.founder_number <= 500 ? 'text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]' : 'text-white/30'}`}>
                                            #{String(user.founder_number).padStart(3, '0')}
                                        </span>
                                    ) : (
                                        <span className="text-white/10">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-bold text-sm">{user.xp || 0} XP</span>
                                        <span className="text-[10px] text-white/30 uppercase">Lvl {user.level || 1}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-white/40">
                                        <span className="text-xs font-mono">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortedUsers.length === 0 && (
                    <div className="p-12 text-center text-white/30 italic">
                        No se encontraron usuarios.
                    </div>
                )}
            </div>
        </div>
    );
}
