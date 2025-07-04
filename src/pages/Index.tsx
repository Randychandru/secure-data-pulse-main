import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Smartphone, BarChart3, Users, ArrowRight, CheckCircle, Star, Zap, Lock, TrendingUp } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Advanced encryption with multi-factor authentication and fraud detection",
      gradient: "from-blue-500 to-green-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process transactions in milliseconds with 99.9% uptime guarantee",
      gradient: "from-blue-500 to-green-500"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "AI-powered insights with real-time data visualization and reporting",
      gradient: "from-blue-500 to-green-500"
    },
    {
      icon: Users,
      title: "Enterprise Ready",
      description: "Scalable solutions for teams with advanced user management features",
      gradient: "from-blue-500 to-green-500"
    }
  ];

  const benefits = [
    "256-bit SSL encryption",
    "Real-time fraud monitoring",
    "Instant KYC verification",
    "24/7 premium support",
    "API-first integration",
    "Global compliance ready"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-fintech-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-fintech-primary to-blue-600 bg-clip-text text-transparent">SecurePay</span>
              <div className="text-xs text-gray-500 font-medium">Next-Gen Fintech</div>
            </div>
          </div>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-fintech-primary to-blue-600 hover:from-fintech-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-fintech-primary/10 to-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-fintech-primary/10 to-blue-500/10 px-4 py-2 rounded-full mb-8">
            <Star className="w-4 h-4 text-fintech-primary" />
            <span className="text-sm font-medium text-fintech-primary">Trusted by 10,000+ businesses worldwide</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-slate-800">The Future of</span>
            <br />
            <span className="bg-gradient-to-r from-fintech-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Technology
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience enterprise-grade fintech solutions with military-level security, 
            instant authentication, and AI-powered analytics that scale with your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-fintech-primary to-blue-600 hover:from-fintech-primary/90 hover:to-blue-600/90 text-white text-lg px-10 py-4 h-14 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 h-14 border-2 border-slate-200 hover:border-fintech-primary hover:text-fintech-primary bg-white/50 backdrop-blur-sm transition-all duration-300"
              onClick={() => alert("Demo video coming soon!")}
            >
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-slate-500 text-sm">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>ISO 27001</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>PCI DSS Level 1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-fintech-primary/10 to-blue-500/10 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold text-fintech-primary">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Built for Modern Finance
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to build, scale, and secure financial applications with confidence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <CardDescription className="text-slate-600 leading-relaxed text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-semibold text-green-600">ENTERPRISE GRADE</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Security & Compliance First
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <Link to="/auth">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 h-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Explore Security Features
                <Shield className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-100">
              {/* Mock dashboard preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-800">Live Analytics</h4>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">₹2.4M</div>
                    <div className="text-sm text-slate-600">Revenue</div>
                    <div className="flex items-center mt-2 text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-xs">+12%</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">1,247</div>
                    <div className="text-sm text-slate-600">Transactions</div>
                    <div className="flex items-center mt-2 text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-xs">+8%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 bg-gradient-to-r from-fintech-primary/20 to-blue-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-fintech-primary to-blue-500 rounded-full animate-pulse" style={{width: '75%'}}></div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-green-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-fintech-primary via-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center relative">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of companies already using SecurePay to revolutionize their financial operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-fintech-primary hover:bg-white/90 px-10 py-4 h-14 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                    Start Free Trial
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 h-14 text-lg backdrop-blur-sm transition-all duration-300"
                  onClick={() => alert("Schedule demo feature coming soon!")}
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-fintech-primary to-blue-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SecurePay</span>
              </div>
              <p className="text-slate-400 text-lg mb-6 max-w-md">
                The most advanced fintech platform for modern businesses. Built with security, scalability, and innovation in mind.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => alert('Social link coming soon!')}>
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => alert('Social link coming soon!')}>
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => alert('Social link coming soon!')}>
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">
              © 2024 SecurePay. All rights reserved. Built with security and innovation.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-slate-400">
              <span className="hover:text-white transition-colors cursor-pointer" onClick={() => alert('Privacy policy coming soon!')}>Privacy</span>
              <span className="hover:text-white transition-colors cursor-pointer" onClick={() => alert('Terms coming soon!')}>Terms</span>
              <span className="hover:text-white transition-colors cursor-pointer" onClick={() => alert('Security info coming soon!')}>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
