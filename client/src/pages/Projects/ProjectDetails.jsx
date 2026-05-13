import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Building2, Tag, Calendar, Ruler, DollarSign, 
  Download, Share2, ArrowLeft, Loader2, CheckCircle2,
  ChevronLeft, ChevronRight, Globe, Phone, Mail, Award,
  ExternalLink, ShieldCheck, Map
} from 'lucide-react';
import api from '../../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (project.images?.length > 0) {
      setActiveImage((activeImage + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project.images?.length > 0) {
      setActiveImage((activeImage - 1 + project.images.length) % project.images.length);
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById(`project-pdf-${project.id}`);
    if (!element) return;
    
    try {
      setDownloading(true);
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800 // Ensure consistent width during capture
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${project.name.replace(/\s+/g, '_')}_Brochure.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate brochure. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `BrokerFlow - ${project.name}`,
      text: `Check out this project: ${project.name} in ${project.location}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Preparing property showcase...</p>
    </div>
  );

  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Projects
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Share2 className="w-5 h-5" /> Share
          </button>
          <button 
            onClick={generatePDF}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {downloading ? 'Generating...' : 'Download Brochure'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Media & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden group shadow-2xl">
            <div className="aspect-[16/9] flex items-center justify-center">
              {project.images?.length > 0 ? (
                <img 
                  src={`${API_BASE}${project.images[activeImage]}`} 
                  alt={project.name} 
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              ) : (
                <Building2 className="w-24 h-24 text-slate-700" />
              )}
            </div>
            
            {project.images?.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${activeImage === i ? 'bg-white w-6' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* About Section */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">{project.name}</h1>
              <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-sm uppercase tracking-wider h-fit">
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-lg">
              <MapPin className="w-6 h-6 text-blue-500" />
              {project.location}
            </div>
            <div className="prose prose-slate max-w-none pt-4 border-t border-slate-100">
              <p className="text-slate-600 text-lg leading-relaxed">{project.description}</p>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              < Award className="w-7 h-7 text-blue-600" />
              Premium Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {project.amenities?.split(',').map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  <span className="font-bold text-slate-700 group-hover:text-white">{amenity.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Builder & Info Table */}
        <div className="space-y-8">
          {/* Price Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/20">
            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-2">Investment Range</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black">₹{Number(project.total_price).toLocaleString()}</span>
              <span className="text-blue-300 font-medium">Total</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 text-sm">
              <span className="text-slate-400">Price per sq ft</span>
              <span className="font-bold">₹{Number(project.price_per_sqft).toLocaleString()}</span>
            </div>
            <button className="w-full mt-6 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
              Book A Visit
            </button>
          </div>

          {/* Info Table Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 divide-y divide-slate-100">
            <div className="pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Project Highlights</h3>
            </div>
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <Tag className="w-4 h-4" /> <span className="text-sm font-medium">Type</span>
              </div>
              <span className="font-bold text-slate-800">{project.property_type}</span>
            </div>
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <Ruler className="w-4 h-4" /> <span className="text-sm font-medium">Area</span>
              </div>
              <span className="font-bold text-slate-800">{project.sqft_area} Sq Ft</span>
            </div>
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" /> <span className="text-sm font-medium">Possession</span>
              </div>
              <span className="font-bold text-slate-800">{project.possession_date || 'TBD'}</span>
            </div>
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-4 h-4" /> <span className="text-sm font-medium">RERA ID</span>
              </div>
              <span className="font-bold text-blue-600 text-xs">{project.rera_number}</span>
            </div>
          </div>

          {/* Builder Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Builder Details</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <p className="font-black text-slate-900 leading-none mb-1">{project.builder_name}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Premium Developer</p>
              </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-slate-100">
              {project.builder_website && (
                <a 
                  href={project.builder_website.startsWith('http') ? project.builder_website : `https://${project.builder_website}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <Globe className="w-4 h-4" /> Visit Website
                </a>
              )}
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* HIDDEN PDF TEMPLATE (Matches Property PDF style)           */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id={`project-pdf-${project.id}`} className="bg-white p-12 w-[800px] font-sans flex flex-col gap-8 text-slate-800 relative">
          
          {/* Watermark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0">
            <div className="text-[140px] font-black text-slate-900 -rotate-45 select-none whitespace-nowrap tracking-widest">
              BrokerFlow
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-blue-600 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-2xl">B</span>
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">BrokerFlow</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{project.name}</h1>
                <div className="flex items-center gap-2 text-xl text-slate-500">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  {project.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Investment</div>
                <div className="text-4xl font-black text-blue-600 mb-3">₹{Number(project.total_price).toLocaleString()}</div>
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-sm font-black text-blue-700 uppercase tracking-wider">{project.status}</span>
                </div>
              </div>
            </div>

            {/* Pricing Details Row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Price / Sq.Ft</div>
                <div className="text-2xl font-black text-slate-900">₹{Number(project.price_per_sqft).toLocaleString()}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Unit Configuration</div>
                <div className="text-2xl font-black text-slate-900">{project.property_type}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Area</div>
                <div className="text-2xl font-black text-slate-900">{project.sqft_area} Sq.Ft</div>
              </div>
            </div>

            {/* Description & Builder Info Row */}
            <div className="grid grid-cols-2 gap-10 py-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Project Overview</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{project.description || 'Premium residential project featuring world-class architecture and modern lifestyle amenities.'}</p>
                
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RERA Certified</div>
                      <div className="text-sm font-bold text-slate-700">{project.rera_number || 'Applied'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Possession</div>
                      <div className="text-sm font-bold text-slate-700">{project.possession_date || 'TBD'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between min-h-[220px]">
                <div>
                  <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Builder Profile</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-black leading-tight">{project.builder_name || 'Premium Developer'}</div>
                      <div className="text-slate-400 text-sm font-medium">{project.builder_website || 'brokerflow.com'}</div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <Map className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold">Location Verified</span>
                  </div>
                  {/* Mock QR Code */}
                  <div className="w-16 h-16 bg-white p-1 rounded-lg">
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                      <span className="text-[8px] text-white text-center font-bold">SCAN<br/>INFO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery Grid - Responsive Rows */}
            {project.images && project.images.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Project Gallery</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {project.images.length === 1 && (
                    <div className="col-span-2">
                      <img src={`${API_BASE}${project.images[0]}`} crossOrigin="anonymous" className="w-full h-[450px] object-cover rounded-3xl shadow-md border border-slate-100" />
                    </div>
                  )}

                  {project.images.length > 1 && project.images.map((img, idx) => (
                    <div key={idx} className={`${project.images.length % 2 !== 0 && idx === project.images.length - 1 ? 'col-span-2' : 'col-span-1'}`}>
                      <img 
                        src={`${API_BASE}${img}`} 
                        crossOrigin="anonymous" 
                        className={`w-full ${project.images.length % 2 !== 0 && idx === project.images.length - 1 ? 'h-[350px]' : 'h-[300px]'} object-cover rounded-3xl shadow-sm border border-slate-100`} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Section */}
            {project.amenities && (
              <div className="pt-4">
                <h3 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-6">Lifestyle Amenities</h3>
                <div className="grid grid-cols-3 gap-4">
                  {project.amenities.split(',').map((am, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-slate-700">{am.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer / Contact Information */}
            <div className="mt-12 pt-10 pb-10 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold">sales@brokerflow.com</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Generated by</div>
                <div className="text-base font-black text-slate-900 tracking-tight">BrokerFlow Digital</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
