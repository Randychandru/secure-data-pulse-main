import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  User, 
  BarChart3, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Activity,
  DollarSign,
  PieChart,
  Calendar,
  Zap,
  Eye,
  Filter,
  Download,
  Plus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
import { auth, db, rtdb } from "@/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { ref as rtdbRef, get, set, onValue } from "firebase/database";

// Define the type for stats
interface Stat {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: any;
  color: string;
  bgColor: string;
  period: string;
}

// Add a type for personal info
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  panNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  occupation?: string;
  annualIncome?: string;
  preferredCurrency?: string;
  accountType?: string;
}

const defaultUserData = (user: FirebaseUser): any => ({
  personalInfo: {
    name: user.displayName || "",
    email: user.email || "",
    phone: user.phoneNumber || "",
    dateOfBirth: "",
    panNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    occupation: "",
    annualIncome: "",
    preferredCurrency: "INR",
    accountType: "personal",
  },
  stats: {
    totalBalance: { title: "Total Balance", value: "₹0", change: "0%", trend: "up", icon: null, color: "text-blue-600", bgColor: "from-blue-100 to-blue-200", period: "This month" },
    // Add more default stats as needed
  },
  transactions: {},
  notifications: {},
});

// Helper to safely convert RTDB entries to array of objects
function safeEntriesToArray(entries: [string, any][]) {
  return entries.map(([id, data]) => {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      return { id, ...data };
    } else {
      return { id };
    }
  });
}

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<Record<string, Stat> | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(true);
        try {
          const userRef = rtdbRef(rtdb, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          if (!snapshot.exists()) {
            // User data does not exist, create it
            await set(userRef, defaultUserData(firebaseUser));
          }
          // Now fetch the data
          const userDataSnap = await get(userRef);
          const userData = userDataSnap.val();
          setPersonalInfo(userData.personalInfo || {});
          setStats(userData.stats || {});
          setTransactions(userData.transactions ? safeEntriesToArray(Object.entries(userData.transactions)) : []);
          setNotifications(userData.notifications ? safeEntriesToArray(Object.entries(userData.notifications)) : []);
        } catch (err) {
          setError("Failed to load user data.");
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Mock data for charts
  const activityData = [
    { name: 'Mon', transactions: 45, amount: 2400, users: 120 },
    { name: 'Tue', transactions: 52, amount: 1398, users: 145 },
    { name: 'Wed', transactions: 48, amount: 9800, users: 180 },
    { name: 'Thu', transactions: 61, amount: 3908, users: 220 },
    { name: 'Fri', transactions: 55, amount: 4800, users: 190 },
    { name: 'Sat', transactions: 40, amount: 3800, users: 160 },
    { name: 'Sun', transactions: 35, amount: 4300, users: 140 },
  ];

  const categoryData = [
    { name: 'Banking', value: 35, color: '#6C5CE7' },
    { name: 'Payments', value: 25, color: '#00B894' },
    { name: 'Analytics', value: 20, color: '#3B82F6' },
    { name: 'KYC', value: 20, color: '#10B981' },
  ];

  const recentTransactions = [
    { id: 1, type: 'credit', amount: 2500, description: 'Salary Deposit', time: '2 hours ago', status: 'completed', merchant: 'Paytm Corp' },
    { id: 2, type: 'debit', amount: 150, description: 'Online Purchase', time: '5 hours ago', status: 'completed', merchant: 'Amazon' },
    { id: 3, type: 'credit', amount: 75, description: 'Cashback Reward', time: '1 day ago', status: 'completed', merchant: 'Razorpay' },
    { id: 4, type: 'debit', amount: 320, description: 'Utility Bill', time: '2 days ago', status: 'pending', merchant: 'BSES Delhi' },
    { id: 5, type: 'credit', amount: 1200, description: 'Freelance Payment', time: '3 days ago', status: 'completed', merchant: 'Upwork' },
  ];

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-fintech-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-fintech-primary to-blue-600 bg-clip-text text-transparent">SecurePay</span>
                  <div className="text-xs text-slate-500">Dashboard</div>
                </div>
              </Link>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hover:bg-slate-100 relative" onClick={() => setShowNotifications(true)}>
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">{notifications.length}</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-slate-100" onClick={() => setShowSettings(true)}>
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <Avatar className="ring-2 ring-fintech-primary/20">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-fintech-primary to-blue-500 text-white font-semibold">
                    {personalInfo?.name?.[0] || personalInfo?.phone?.[3] || personalInfo?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-800">{personalInfo?.name || personalInfo?.phone || personalInfo?.email || "User"}</div>
                  <div className="text-xs text-slate-500">Premium User</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                onClick={async () => {
                  await signOut(auth);
                  navigate("/auth");
                }}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Good morning, {personalInfo?.name?.split(" ")[0] || personalInfo?.phone || personalInfo?.email || "User"}! 👋
              </h1>
              <p className="text-slate-600">Here's what's happening with your financial data today.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                className="bold-cta"
                onClick={() => alert("Export feature coming soon!")}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bold-cta"
                onClick={() => alert("New Transaction feature coming soon!")}>
                <Plus className="w-4 h-4 mr-2" />
                New Transaction
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats && Object.entries(stats).map(([key, stat]) => (
            <Card key={key} className="glass-card">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color} bg-white shadow-md`}>
                    {stat.icon && <stat.icon className="w-7 h-7" />}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{stat.trend === "up" ? "+" : "-"}{stat.change}</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 mb-1">{stat.title}</div>
                <div className="text-xs text-slate-400">{stat.period}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simple User Profile Section */}
        {personalInfo && (personalInfo.occupation || personalInfo.annualIncome) && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-slate-800 text-xl font-bold flex items-center">
                <User className="w-5 h-5 mr-2 text-fintech-primary" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-slate-600">Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-700 text-sm">Personal Details</h4>
                  <div className="space-y-2">
                    {personalInfo.occupation && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Occupation:</span>
                        <span className="text-sm font-medium text-slate-800">{personalInfo.occupation}</span>
                      </div>
                    )}
                    {personalInfo.annualIncome && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Annual Income:</span>
                        <span className="text-sm font-medium text-slate-800">{personalInfo.annualIncome}</span>
                      </div>
                    )}
                    {personalInfo.accountType && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Account Type:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {personalInfo.accountType}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-700 text-sm">Account Details</h4>
                  <div className="space-y-2">
                    {personalInfo.preferredCurrency && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Currency:</span>
                        <span className="text-sm font-medium text-slate-800">{personalInfo.preferredCurrency}</span>
                      </div>
                    )}
                    {personalInfo.panNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">PAN Number:</span>
                        <span className="text-sm font-mono text-slate-800">{personalInfo.panNumber}</span>
                      </div>
                    )}
                    {personalInfo.address && (
                      <div>
                        <span className="text-sm text-slate-600">Address:</span>
                        <p className="text-sm font-medium text-slate-800 mt-1">{personalInfo.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Chart */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-800 text-xl font-bold">Transaction Analytics</CardTitle>
                    <CardDescription className="text-slate-600">Daily performance metrics and trends</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => alert("Filter feature coming soon!")}>
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <Button 
                        variant={selectedPeriod === "7d" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedPeriod("7d")}
                        className={`${selectedPeriod === "7d" ? "bg-white shadow-sm" : "hover:bg-slate-50"} text-xs`}
                      >
                        7D
                      </Button>
                      <Button 
                        variant={selectedPeriod === "30d" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedPeriod("30d")}
                        className={`${selectedPeriod === "30d" ? "bg-white shadow-sm" : "hover:bg-slate-50"} text-xs`}
                      >
                        30D
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="url(#colorGradient)" 
                        strokeWidth={3}
                        dot={{ fill: '#6C5CE7', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: '#6C5CE7', strokeWidth: 2, fill: 'white' }}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6C5CE7" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Tabs */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-slate-800 text-xl font-bold">Detailed Insights</CardTitle>
                <CardDescription className="text-slate-600">Comprehensive analytics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Transactions</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-700">Account Completion</p>
                          <span className="text-sm font-semibold text-slate-800">85%</span>
                        </div>
                        <Progress value={85} className="h-3 bg-slate-100" />
                        <p className="text-xs text-slate-500">Complete remaining steps to unlock premium features</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-700">KYC Verification</p>
                          <span className="text-sm font-semibold text-green-600">Verified ✓</span>
                        </div>
                        <Progress value={100} className="h-3 bg-green-100" />
                        <p className="text-xs text-green-600">All documents verified successfully</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="transactions" className="mt-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Bar dataKey="transactions" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                          <defs>
                            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#00B894" />
                              <stop offset="100%" stopColor="#55EFC4" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-800">2FA Enabled</p>
                          <p className="text-xs text-green-600">Multi-factor authentication active</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-800">PAN Verified</p>
                          <p className="text-xs text-blue-600">Document verification complete</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Category Distribution */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-slate-800 text-lg font-bold">Usage Analytics</CardTitle>
                <CardDescription className="text-slate-600">Service distribution breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={6}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-800 text-lg font-bold">Recent Activity</CardTitle>
                    <CardDescription className="text-slate-600">Latest transactions and updates</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 4).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 group">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-xl ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{transaction.description}</p>
                          <p className="text-xs text-slate-500">{transaction.merchant} • {transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="bold-cta w-full mt-4"
                  onClick={() => alert("View All Transactions feature coming soon!")}
                >
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-slate-800 text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="bold-cta"
                  onClick={() => alert("Add Payment Method feature coming soon!")}>
                  <CreditCard className="w-4 h-4 mr-3" />
                  Add Payment Method
                </Button>
                <Button className="bold-cta"
                  onClick={() => alert("Update Profile feature coming soon!")}>
                  <User className="w-4 h-4 mr-3" />
                  Update Profile
                </Button>
                <Button
                  className="bold-cta w-full flex items-center justify-start bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600"
                  onClick={() => alert("Export Analytics feature coming soon!")}
                >
                  <Download className="w-4 h-4 mr-3" />
                  Export Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-sm fintech-card glass-card shadow-2xl p-0">
          <div className="h-1 w-full bg-gradient-to-r from-fintech-primary via-fintech-secondary to-fintech-primary rounded-t-xl" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-fintech-text">Notifications</DialogTitle>
              <DialogDescription className="text-fintech-primary font-medium">Recent updates and alerts</DialogDescription>
            </DialogHeader>
            <div className="divide-y divide-slate-100 mt-4">
              {notifications.map((n) => (
                <div key={n.id} className="py-3">
                  <div className="font-semibold text-fintech-text">{n.title}</div>
                  <div className="text-sm text-gray-700 font-medium opacity-90">{n.description}</div>
                  <div className="text-xs text-slate-400 mt-1">{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md fintech-card glass-card shadow-2xl p-0">
          <div className="h-1 w-full bg-gradient-to-r from-fintech-primary via-fintech-secondary to-fintech-primary rounded-t-xl" />
          <div className="p-8">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-fintech-text">Settings</DialogTitle>
              <DialogDescription className="text-fintech-primary font-medium">Manage your account settings</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <div className="font-semibold text-fintech-text mb-1">Change Password</div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Change password feature coming soon!')}>Change Password</Button>
              </div>
              <div>
                <div className="font-semibold text-fintech-text mb-1">Notification Preferences</div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Notification preferences feature coming soon!')}>Edit Preferences</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
