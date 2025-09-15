// frontend/app/dashboard/team/page.tsx

'use client';

import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  joinedDate: string;
  lastActive: string;
}

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Mock data - replace with real data from API
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      status: 'active',
      joinedDate: '2024-02-20',
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'viewer',
      status: 'pending',
      joinedDate: '2024-03-10',
      lastActive: 'Never'
    }
  ]);

  const roleColors = {
    admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    editor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    viewer: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    inactive: 'bg-gray-500/20 text-gray-400'
  };

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Never'
      };
      setTeamMembers([...teamMembers, newMember]);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    setSelectedMember(null);
  };

  const handleRoleChange = (id: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, role: newRole } : member
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Team Management</h1>
          <p className="text-muted">Manage team members and their permissions</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-xs text-green-400">+2 this month</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">{teamMembers.length}</div>
          <div className="text-sm muted">Total Members</div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {teamMembers.filter(m => m.role === 'admin').length}
          </div>
          <div className="text-sm muted">Admins</div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {teamMembers.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm muted">Active Users</div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {teamMembers.filter(m => m.status === 'pending').length}
          </div>
          <div className="text-sm muted">Pending Invites</div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-white/5">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted">Member</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Role</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Joined</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Last Active</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{member.name}</div>
                        <div className="text-sm muted">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[member.role]} bg-transparent`}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[member.status]}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted">{member.joinedDate}</td>
                  <td className="p-4 text-sm text-muted">{member.lastActive}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setSelectedMember(member.id)}
                      >
                        <Edit className="w-4 h-4 text-muted" />
                      </button>
                      <button 
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-on-surface mb-4">Invite Team Member</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="colleague@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="viewer">Viewer - Can view data and reports</option>
                  <option value="editor">Editor - Can edit and create reports</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4 mt-6">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleInvite}
                className="btn-primary"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Info */}
      <div className="mt-8 card p-6">
        <h2 className="text-xl font-semibold text-on-surface mb-4">Role Permissions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <h3 className="font-medium text-on-surface">Admin</h3>
            </div>
            <ul className="space-y-1 text-sm muted">
              <li>• Full system access</li>
              <li>• Manage team members</li>
              <li>• Delete data sources</li>
              <li>• Access billing</li>
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <h3 className="font-medium text-on-surface">Editor</h3>
            </div>
            <ul className="space-y-1 text-sm muted">
              <li>• Create & edit reports</li>
              <li>• Run queries</li>
              <li>• Connect data sources</li>
              <li>• View analytics</li>
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h3 className="font-medium text-on-surface">Viewer</h3>
            </div>
            <ul className="space-y-1 text-sm muted">
              <li>• View reports</li>
              <li>• View analytics</li>
              <li>• Export data</li>
              <li>• Read-only access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}