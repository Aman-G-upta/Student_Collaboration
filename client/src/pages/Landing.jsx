import { Link } from "react-router-dom";
import {
    LayoutDashboard, Users, FolderKanban, FileCheck2, ClipboardCheck,
    UserCheck, ArrowRight, CheckCircle2, GraduationCap, Briefcase, Sparkles,
    Image as ImageIcon, History, Crown, Clock, BarChart3, Bell, MessageSquare
} from "lucide-react";

const features = [
    { icon: Users, title: "Workspaces & Join Codes", desc: "Faculty create a classroom workspace; students join instantly with a single code." },
    { icon: FolderKanban, title: "Teams & Invites", desc: "Students create a project, invite teammates by email, and accept or reject invites." },
    { icon: UserCheck, title: "Guide Requests", desc: "Team leaders request a faculty guide; faculty accept or reject right from their dashboard." },
    { icon: ClipboardCheck, title: "Milestones & Tasks", desc: "Guides lay out milestones and assign tasks; students update status as work progresses." },
    { icon: FileCheck2, title: "Document Submissions", desc: "Upload SRS docs, reports and PPTs with full version history — nothing gets overwritten." },
    { icon: History, title: "Review & Feedback", desc: "Guides approve or request changes on every version, with feedback attached inline." },
    { icon: ImageIcon, title: "Workspace Materials", desc: "Faculty share reference material and images with the whole classroom, WhatsApp-style." },
    { icon: LayoutDashboard, title: "Role-Based Dashboard", desc: "Students and faculty each see exactly what's relevant to them — nothing more." },
];

const upcoming = [
    { icon: BarChart3, title: "Rubric-Based Evaluation", desc: "Structured scoring tied to each project's final submission." },
    { icon: MessageSquare, title: "Discussion Threads", desc: "Per-project conversation between guide and team, without leaving the platform." },
    { icon: Bell, title: "Notifications", desc: "Deadline reminders and review updates, delivered in-app." },
];

const facultyPerks = [
    "Create a workspace and share the join code",
    "Accept or reject guide requests from teams",
    "Set milestones and assign tasks to members",
    "Review submissions — approve or request changes",
];

const studentPerks = [
    "Join your class workspace with one code",
    "Build your team and invite classmates by email",
    "Track every milestone and task assigned to you",
    "Upload work and see version history + feedback",
];

const steps = [
    { label: "Create / Join", desc: "Faculty opens a workspace, students join with a code" },
    { label: "Form a Team", desc: "Invite teammates, roles are set automatically" },
    { label: "Get a Guide", desc: "Leader requests a faculty guide for the project" },
    { label: "Plan the Work", desc: "Milestones and tasks laid out by the guide" },
    { label: "Submit & Review", desc: "Upload versions, get approved or asked to revise" },
];

const Landing = () => {
    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-brand-400/30 rounded-full blur-3xl" />
                <div className="absolute top-40 -right-32 w-[26rem] h-[26rem] bg-violet-300/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] bg-sky-300/20 rounded-full blur-3xl" />
            </div>

            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-brand-700 text-lg">
                        <LayoutDashboard size={22} />
                        Student Collaborator
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-700 transition px-3 py-2">
                            Log In
                        </Link>
                        <Link to="/register" className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition shadow-card">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* hero — now two columns with a live-look preview */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand-700 bg-brand-100/80 px-3 py-1.5 rounded-full mb-6">
                            <Sparkles size={13} /> BUILT FOR PROJECT-BASED LEARNING
                        </span>

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Every student project,
                            <br />
                            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                                one connected platform
                            </span>
                        </h1>

                        <p className="text-gray-500 text-lg mt-6 max-w-lg">
                            Replace scattered WhatsApp groups, spreadsheets and email threads with a single place to manage teams, guides, milestones and submissions.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-9">
                            <Link to="/register" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition shadow-cardHover w-full sm:w-auto justify-center">
                                Create your account <ArrowRight size={17} />
                            </Link>
                            <Link to="/login" className="text-gray-700 font-medium px-7 py-3.5 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition w-full sm:w-auto text-center">
                                Log In
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-brand-500" /> Role-based access</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-brand-500" /> Versioned submissions</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-brand-500" /> Built for colleges</span>
                        </div>
                    </div>

                    {/* preview mockup — mirrors the actual project detail screen */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-brand-200/40 to-violet-200/40 rounded-[2rem] blur-2xl -z-10" />
                        <div className="bg-white border border-gray-100 rounded-3xl shadow-cardHover p-5 sm:p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="font-bold text-gray-900">AI Career Advisor</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Artificial Intelligence • BE IT 2026</p>
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">Active</span>
                            </div>

                            <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">P</div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-800">Prof. Sharma — Guide</p>
                                    <p className="text-[11px] text-gray-400">Assigned</p>
                                </div>
                                <CheckCircle2 size={15} className="text-green-500 ml-auto shrink-0" />
                            </div>

                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-xs font-semibold text-gray-700">Milestones</p>
                                    <p className="text-[11px] text-gray-400">2/4 • 50%</p>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-600 w-1/2" />
                                </div>
                            </div>

                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 rounded-lg px-3 py-2">
                                    <CheckCircle2 size={13} className="text-green-600 shrink-0" /> SRS Document — v2 approved
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-amber-50 rounded-lg px-3 py-2">
                                    <Clock size={13} className="text-amber-500 shrink-0" /> Final Report — pending review
                                </div>
                            </div>

                            <div className="flex -space-x-2">
                                {["A", "R", "P"].map((initial, i) => (
                                    <div key={initial} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-brand-500" : "bg-violet-500"}`}>
                                        {i === 0 ? <Crown size={11} /> : initial}
                                    </div>
                                ))}
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-medium text-gray-500">
                                    +1
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* workflow strip */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-3xl shadow-card p-6 sm:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative">
                        {steps.map((step, i) => (
                            <div key={step.label} className="relative">
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-4 left-[60%] w-full h-px bg-gradient-to-r from-brand-200 to-transparent" />
                                )}
                                <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center mb-3">
                                    {i + 1}
                                </div>
                                <p className="text-sm font-semibold text-gray-800">{step.label}</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* features */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Everything a project needs, in one thread</h2>
                    <p className="text-gray-500 mt-2">No more chasing updates across five different apps.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-cardHover hover:-translate-y-1 p-5 transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                                <Icon size={18} className="text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* role split */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-brand-50 to-white p-8 shadow-card">
                        <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center mb-4">
                            <Briefcase size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">For Faculty</h3>
                        <ul className="space-y-3">
                            {facultyPerks.map((p) => (
                                <li key={p} className="flex items-start gap-2.5 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-brand-500 mt-0.5 shrink-0" /> {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-violet-50 to-white p-8 shadow-card">
                        <div className="w-11 h-11 rounded-xl bg-violet-600 flex items-center justify-center mb-4">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">For Students</h3>
                        <ul className="space-y-3">
                            {studentPerks.map((p) => (
                                <li key={p} className="flex items-start gap-2.5 text-sm text-gray-600">
                                    <CheckCircle2 size={16} className="text-violet-500 mt-0.5 shrink-0" /> {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* coming soon */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
                <div className="text-center mb-8">
                    <span className="inline-block text-xs font-semibold tracking-wide text-violet-700 bg-violet-100 px-3 py-1.5 rounded-full mb-3">
                        ON THE ROADMAP
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Still being built</h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                    {upcoming.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="rounded-2xl border border-dashed border-gray-200 p-5 text-center">
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                <Icon size={16} className="text-gray-400" />
                            </div>
                            <h3 className="font-semibold text-gray-700 text-sm mb-1">{title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA band */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-600 p-10 sm:p-14 text-center">
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

                    <h2 className="relative text-2xl sm:text-3xl font-bold text-white mb-3">Ready to bring your projects together?</h2>
                    <p className="relative text-brand-100 mb-8 max-w-md mx-auto">Set up your first workspace in under a minute — no installs, no spreadsheets.</p>
                    <Link to="/register" className="relative inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition shadow-lg">
                        Get Started Free <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            <footer className="text-center text-xs text-gray-400 pb-10">
                Student Collaborator — a project management platform for academic teams
            </footer>
        </div>
    );
};

export default Landing;