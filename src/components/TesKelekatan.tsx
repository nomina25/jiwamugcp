import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Shield, HelpCircle, ArrowRight, RefreshCw, Send } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

interface Question {
  id: number;
  text: string;
  category: "anxiety" | "avoidance";
}

const questions: Question[] = [
  { id: 1, text: "Saya sering khawatir pasangan atau sahabat akan meninggalkan atau berhenti peduli pada saya.", category: "anxiety" },
  { id: 2, text: "Saya merasa tidak nyaman ketika seseorang mencoba terlalu dekat dengan saya secara emosional.", category: "avoidance" },
  { id: 3, text: "Saya membutuhkan validasi atau penegasan konstan dari orang lain bahwa saya dicintai.", category: "anxiety" },
  { id: 4, text: "Saya lebih memilih menyelesaikan masalah sendiri daripada bergantung pada bantuan orang lain.", category: "avoidance" },
  { id: 5, text: "Saya sering merasa cemas bahwa saya tidak cukup berharga bagi orang-orang penting dalam hidup saya.", category: "anxiety" },
  { id: 6, text: "Ketika hubungan terasa sangat dekat, saya cenderung mencari alasan untuk menarik diri atau menjaga jarak.", category: "avoidance" },
  { id: 7, text: "Saya cenderung cepat merasa kecewa jika orang lain tidak memberikan perhatian sebanyak yang saya berikan.", category: "anxiety" },
  { id: 8, text: "Sangat sulit bagi saya untuk jujur menceritakan ketakutan atau kelemahan terdalam saya kepada orang lain.", category: "avoidance" },
  { id: 9, text: "Saya sering merasa bahwa orang lain tidak akan mencintai saya apa adanya jika mereka tahu kekurangan saya.", category: "anxiety" },
  { id: 10, text: "Bagi saya, kemandirian dan kebebasan mutlak jauh lebih aman daripada komitmen yang mendalam.", category: "avoidance" },
  { id: 11, text: "Saya sering merasa kewalahan oleh emosi saya sendiri dan takut emosi tersebut akan merusak hubungan saya.", category: "anxiety" },
  { id: 12, text: "Saya sulit mempercayai bahwa orang lain akan selalu ada saat saya benar-benar membutuhkan mereka.", category: "avoidance" }
];

export default function TesKelekatan() {
  const [step, setStep] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<{
    style: string;
    anxietyScore: number;
    avoidanceScore: number;
    title: string;
    description: string;
    strengths: string[];
    growth: string[];
    recommendation: string;
  } | null>(null);

  // Form fields for Firestore CRM submissions
  const [userNama, setUserNama] = useState("");
  const [userWhatsapp, setUserWhatsapp] = useState("");
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  const handleStart = () => {
    setAnswers({});
    setCurrentIdx(0);
    setUserNama("");
    setUserWhatsapp("");
    setIsReportSubmitted(false);
    setStep("quiz");
  };

  const handleAnswer = (value: number) => {
    const q = questions[currentIdx];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      setStep("welcome");
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNama || !userWhatsapp || !results) return;

    try {
      await addDoc(collection(db, "test_results"), {
        nama: userNama,
        whatsapp: userWhatsapp,
        gayaKelekatan: results.title,
        anxietyScore: results.anxietyScore,
        avoidanceScore: results.avoidanceScore,
        tanggalTes: new Date().toISOString()
      });
      setIsReportSubmitted(true);
    } catch (err) {
      console.error("Error saving test result to Firestore:", err);
      // Fallback
      setIsReportSubmitted(true);
    }
  };

  const calculateResult = (finalAnswers: Record<number, number>) => {
    let anxietySum = 0;
    let avoidanceSum = 0;
    let anxietyCount = 0;
    let avoidanceCount = 0;

    questions.forEach((q) => {
      const val = finalAnswers[q.id] || 3; // default neutral if somehow missing
      if (q.category === "anxiety") {
        anxietySum += val;
        anxietyCount++;
      } else {
        avoidanceSum += val;
        avoidanceCount++;
      }
    });

    const anxietyAvg = anxietySum / anxietyCount;
    const avoidanceAvg = avoidanceSum / avoidanceCount;

    // Threshold for high score is 3.5 on a scale of 1 to 5
    const isHighAnxiety = anxietyAvg >= 3.3;
    const isHighAvoidance = avoidanceAvg >= 3.3;

    let style = "";
    let title = "";
    let description = "";
    let strengths: string[] = [];
    let growth: string[] = [];
    let recommendation = "";

    if (!isHighAnxiety && !isHighAvoidance) {
      style = "Secure (Aman)";
      title = "Kelekatan Aman (Secure Attachment)";
      description = "Kamu merasa nyaman dengan keintiman sekaligus kemandirian. Kamu cenderung melihat dirimu berharga dan memandang orang lain dapat diandalkan secara emosional. Hubunganmu dicirikan oleh komunikasi terbuka, saling percaya, dan penyelesaian konflik yang sehat tanpa drama emosional berlebih.";
      strengths = [
        "Mampu mengomunikasikan batas dan kebutuhan diri dengan jujur",
        "Tidak mudah terancam oleh kemandirian atau kesibukan pasangan",
        "Menawarkan ruang aman (secure base) bagi orang-orang tersayang",
        "Mengelola emosi negatif dengan stabil dan asertif"
      ];
      growth = [
        "Membantu menyadari bahwa orang lain mungkin tidak memiliki tingkat kesiapan emosional yang sama dengamu",
        "Tetap merawat kepekaan terhadap pola defensif pasangan yang cemas atau menghindar"
      ];
      recommendation = "Pertahankan kualitas relasi yang sehat ini! Kamu adalah kandidat luar biasa untuk menjadi Attachment Facilitator (CAF) di Jiwamu, guna membantu orang lain di sekitarmu belajar membangun rasa aman relasional.";
    } else if (isHighAnxiety && !isHighAvoidance) {
      style = "Anxious (Cemas)";
      title = "Kelekatan Cemas (Anxious-Preoccupied)";
      description = "Kamu memiliki kapasitas besar untuk mencintai secara mendalam, namun sering kali dilingkupi rasa cemas akan ditinggalkan atau tidak dicintai kembali secara setara. Kamu cenderung sangat peka terhadap perubahan atmosfer emosional pasangan, namun sering kali salah menafsirkan jarak fisik/kesibukan sebagai tanda penolakan.";
      strengths = [
        "Sangat peka, berempati tinggi, dan peduli mendalam pada perasaan orang lain",
        "Mendambakan koneksi emosional yang tulus dan tidak takut berkomitmen",
        "Setia dan selalu bersedia memberikan upaya terbaik untuk merawat hubungan"
      ];
      growth = [
        "Belajar membedakan antara ancaman nyata dan rasa cemas lama yang terproyeksi",
        "Membangun regulasi emosi mandiri sebelum mengekspresikan ketakutan kepada pasangan",
        "Berlatih menyatakan kebutuhan secara tenang (RBR) daripada melayangkan tuntutan"
      ];
      recommendation = "Kelas Level 1 - Certification in Attachment Facilitator (CAF) akan membantumu memahami asal-usul kecemasan ini secara ilmiah dan penuh cinta. Layanan coaching bulanan kami juga siap mendampingimu mengurai lingkaran ketakutanmu.";
    } else if (!isHighAnxiety && isHighAvoidance) {
      style = "Avoidant (Menghindar)";
      title = "Kelekatan Menghindar (Dismissive-Avoidant)";
      description = "Kamu sangat menghargai kemandirian, kebebasan, dan kekuatan diri. Namun, kemandirian ini sering kali menjadi tameng pertahanan bawah sadar untuk melindungimu dari ketakutan akan penolakan atau dikendalikan oleh orang lain. Kamu cenderung menarik diri atau merasa 'sesak' saat hubungan mulai terasa intim dan penuh tuntutan emosional.";
      strengths = [
        "Mandiri, tangguh, dan sangat andal dalam mengelola hidup secara mandiri",
        "Tenang dan rasional dalam menghadapi krisis luar",
        "Menghargai batasan ruang pribadi secara konsisten"
      ];
      growth = [
        "Belajar menyadari bahwa membutuhkan orang lain bukanlah tanda kelemahan",
        "Mencoba bertahan dalam percakapan emosional alih-alih langsung menarik diri",
        "Mengomunikasikan kebutuhan akan 'waktu sendiri' secara asertif tanpa melukai"
      ];
      recommendation = "Memahami pola menghindar membutuhkan ruang yang sangat aman dan bebas dari penghakiman. Layanan Psikoanalisis atau coaching di Jiwamu Center dirancang untuk membantumu melonggarkan baju zirah pelindung batinmu dengan ritme yang sepenuhnya kamu kendalikan.";
    } else {
      style = "Disorganized (Disorganisasi)";
      title = "Kelekatan Ketakutan-Menghindar (Fearful-Avoidant / Disorganized)";
      description = "Kamu berada dalam dilema emosional yang konstan: sangat mendambakan kedekatan, namun di saat yang sama merasa ketakutan luar biasa ketika kedekatan itu terwujud. Pola ini sering kali membuatmu terjebak dalam siklus 'tarik-ulur' (mendekat lalu mendorong pergi), karena rasa tidak aman yang berakar mendalam tentang kelayakan dirimu dan keandalan orang lain.";
      strengths = [
        "Memiliki kedalaman rasa yang luar biasa dan pemahaman emosi yang kompleks",
        "Sangat adaptif dan mampu mendeteksi ketidakjujuran dengan cepat",
        "Memiliki potensi empati yang besar setelah luka batin berhasil diproses"
      ];
      growth = [
        "Membangun landasan rasa aman internal (safe haven) secara bertahap",
        "Mengurangi kebiasaan merusak hubungan secara sengaja (sabotase diri) saat kedekatan terbentuk",
        "Belajar menoleransi ketidakpastian emosional secara bertahap"
      ];
      recommendation = "Luka kelekatan ganda (cemas & menghindar) sangat disarankan untuk diproses melalui pendampingan berkelanjutan. Kamu bisa memulai dengan sesi Pre-Treatment gratis di Jiwamu Center atau belajar menatanya di kelas Level 2 - Certification in Attachment Coaching (CAC).";
    }

    setResults({
      style,
      anxietyScore: parseFloat(anxietyAvg.toFixed(2)),
      avoidanceScore: parseFloat(avoidanceAvg.toFixed(2)),
      title,
      description,
      strengths,
      growth,
      recommendation
    });
    setStep("result");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-8 sm:p-12 brutal-border brutal-shadow text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-60 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full filter blur-3xl opacity-60 -ml-20 -mb-20"></div>

            <div className="relative">
              <div className="inline-flex p-4 rounded-2xl bg-[#FF71CF] text-black brutal-border shadow-sm mb-6">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <span className="block text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit mx-auto brutal-border-thin shadow-sm mb-4">
                Asesmen Pola Hubungan
              </span>
              <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4 leading-snug">
                Temukan Gaya Kelekatan <span className="underline decoration-wavy decoration-[#8B5CF6]">Jiwamu</span>
              </h1>
              <p className="text-slate-800 font-medium text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                Asesmen interaktif 12 pertanyaan berdasarkan teori kelekatan (attachment theory) untuk mengidentifikasi bagaimana kamu melihat diri sendiri, merespons konflik, dan membangun rasa aman relasional dengan orang lain.
              </p>

              <div className="bg-[#BFDBFE] rounded-2xl p-6 mb-8 max-w-lg mx-auto text-left space-y-4 brutal-border brutal-shadow-sm text-black">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">
                    <strong>Privasi Terjaga:</strong> Seluruh jawabanmu hanya diproses langsung di browsermu dan tidak dikirimkan ke server kami.
                  </p>
                </div>
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">
                    <strong>Waktu Pengerjaan:</strong> Hanya membutuhkan sekitar 3-5 menit. Jawablah dengan jujur sesuai apa yang benar-benar kamu rasakan, bukan apa yang idealnya kamu inginkan.
                  </p>
                </div>
              </div>

              <button
                id="start-attachment-test-btn"
                onClick={handleStart}
                className="inline-flex items-center gap-2 bg-[#FF71CF] hover:bg-[#8B5CF6] hover:text-white text-black font-black px-8 py-4 rounded-2xl brutal-border brutal-shadow transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Mulai Tes Kelekatan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-8 sm:p-12 brutal-border brutal-shadow relative"
          >
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs text-black font-black mb-2 font-mono">
                <span>PERTANYAAN {currentIdx + 1} DARI {questions.length}</span>
                <span>{Math.round(((currentIdx) / questions.length) * 100)}% SELESAI</span>
              </div>
              <div className="w-full bg-[#FDF4FF] h-4 rounded-full overflow-hidden brutal-border-thin">
                <div
                  className="bg-[#8B5CF6] h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="min-h-[160px] flex flex-col justify-center mb-10 bg-[#FDF4FF] p-6 rounded-2xl brutal-border-thin">
              <motion.h2
                key={questions[currentIdx].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="font-sans text-xl sm:text-2xl text-[#1A1A1A] leading-relaxed text-center font-extrabold"
              >
                {questions[currentIdx].text}
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
              {[
                { label: "Sangat Tidak Setuju", val: 1, color: "bg-[#FF71CF] hover:bg-[#8B5CF6] hover:text-white text-black brutal-border brutal-shadow-sm active:translate-y-0.5 active:shadow-none transition-all" },
                { label: "Tidak Setuju", val: 2, color: "bg-[#F97316] hover:bg-[#8B5CF6] hover:text-white text-black brutal-border brutal-shadow-sm active:translate-y-0.5 active:shadow-none transition-all" },
                { label: "Ragu-Ragu", val: 3, color: "bg-white hover:bg-[#FEF08A] text-black brutal-border brutal-shadow-sm active:translate-y-0.5 active:shadow-none transition-all" },
                { label: "Setuju", val: 4, color: "bg-[#BFDBFE] hover:bg-[#8B5CF6] hover:text-white text-black brutal-border brutal-shadow-sm active:translate-y-0.5 active:shadow-none transition-all" },
                { label: "Sangat Setuju", val: 5, color: "bg-[#D9F99D] hover:bg-[#8B5CF6] hover:text-white text-black brutal-border brutal-shadow-sm active:translate-y-0.5 active:shadow-none transition-all" }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleAnswer(opt.val)}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl cursor-pointer text-center group h-24 ${opt.color}`}
                >
                  <span className="text-xl font-black mb-1">{opt.val}</span>
                  <span className="text-xs font-black leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-10 border-t-2 border-black pt-6">
              <button
                onClick={handleBack}
                className="text-xs font-black text-[#1A1A1A] hover:text-[#8B5CF6] flex items-center gap-1 cursor-pointer bg-white px-3.5 py-2 rounded-xl brutal-border-thin shadow-sm"
              >
                ← Kembali
              </button>
              <span className="text-xs font-mono text-slate-500 font-bold">Pilihlah salah satu tombol di atas</span>
            </div>
          </motion.div>
        )}

        {step === "result" && results && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 sm:p-12 brutal-border brutal-shadow overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#FF71CF] via-[#FFD600] to-[#8B5CF6]"></div>

              <div className="text-center max-w-2xl mx-auto mb-10 pt-4">
                <span className="inline-block text-xs font-black bg-[#FFD600] text-black px-4 py-1.5 rounded-full brutal-border-thin shadow-sm mb-4">Hasil Analisis</span>
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                  Gaya Kelekatan Anda adalah:
                </h2>
                <h3 className="font-sans text-3xl sm:text-4xl text-[#8B5CF6] font-black mt-3 mb-4 bg-[#FDF4FF] px-6 py-3.5 rounded-2xl brutal-border shadow-sm inline-block">
                  {results.title}
                </h3>
                <p className="text-sm text-[#1A1A1A] font-mono font-bold bg-[#D9F99D] p-2.5 rounded-xl border-2 border-black max-w-md mx-auto shadow-sm">
                  Cemas: {results.anxietyScore}/5.00 | Menghindar: {results.avoidanceScore}/5.00
                </p>
              </div>

              <div className="text-[#1A1A1A] text-sm sm:text-base leading-relaxed font-bold bg-[#FDF4FF] p-6 rounded-2xl brutal-border mb-8">
                <p>{results.description}</p>
              </div>

              {/* Form Kirim Hasil Lengkap */}
              <div className="bg-[#BFDBFE] rounded-2xl p-6 sm:p-8 border-2 border-black mb-8 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit mb-3 block border border-black shadow-sm">
                  Dapatkan Analisis Lengkap
                </span>
                <h4 className="font-sans text-base sm:text-lg font-black text-[#1A1A1A] mb-2">
                  Kirim Hasil Analisis Lengkap & Tips Relasional via WhatsApp
                </h4>
                <p className="text-xs text-slate-800 font-bold mb-4">
                  Masukkan Nama dan No. WhatsApp Anda. Kami akan mengirimkan dokumen analisis mendalam serta panduan langkah demi langkah memulihkan rasa aman batin secara gratis.
                </p>

                {isReportSubmitted ? (
                  <div className="bg-[#D9F99D] border-2 border-black rounded-xl p-4 flex gap-3 items-center text-xs">
                    <span className="text-lg">✨</span>
                    <div>
                      <p className="font-black text-black">Data Berhasil Terkirim!</p>
                      <p className="text-slate-800 font-bold text-[11px] mt-0.5">Laporan analisis lengkap sedang diproses dan akan segera dikirimkan ke nomor WhatsApp Anda secara otomatis.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendReport} className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="report-user-name"
                      type="text"
                      placeholder="Nama Lengkap"
                      value={userNama}
                      onChange={(e) => setUserNama(e.target.value)}
                      className="bg-white border-2 border-black rounded-xl px-4 py-3 text-xs flex-1 placeholder:text-slate-400 font-bold"
                      required
                    />
                    <input
                      id="report-user-phone"
                      type="tel"
                      placeholder="No. WhatsApp"
                      value={userWhatsapp}
                      onChange={(e) => setUserWhatsapp(e.target.value)}
                      className="bg-white border-2 border-black rounded-xl px-4 py-3 text-xs flex-1 placeholder:text-slate-400 font-mono font-bold"
                      required
                    />
                    <button
                      id="report-submit-btn"
                      type="submit"
                      className="bg-[#FF71CF] hover:bg-white text-black font-black text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer border-2 border-black shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0"
                    >
                      Kirim Analisis Lengkap
                    </button>
                  </form>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#D9F99D] rounded-2xl p-6 brutal-border brutal-shadow-sm text-black">
                  <h4 className="font-sans text-sm font-black text-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b-2 border-black pb-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                    Kekuatan Relasional Kamu
                  </h4>
                  <ul className="space-y-3">
                    {results.strengths.map((str, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-900 flex items-start gap-2 font-bold">
                        <span className="text-[#8B5CF6] font-extrabold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#BFDBFE] rounded-2xl p-6 brutal-border brutal-shadow-sm text-black">
                  <h4 className="font-sans text-sm font-black text-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b-2 border-black pb-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF71CF]"></span>
                    Area Pertumbuhan Mandiri
                  </h4>
                  <ul className="space-y-3">
                    {results.growth.map((gro, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-900 flex items-start gap-2 font-bold">
                        <span className="text-[#FF71CF] font-extrabold">•</span>
                        <span>{gro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-[#FEF08A] rounded-2xl p-6 brutal-border brutal-shadow text-black mb-8">
                <h4 className="font-sans text-sm font-black text-black uppercase tracking-wider mb-3">
                  Rekomendasi Langkah Bersama Jiwamu:
                </h4>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed mb-4 font-bold">
                  {results.recommendation}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20sudah%20mengikuti%20Tes%20Kelekatan%20dengan%20hasil%20gaya%20kelekatan%20dan%20ingin%20berkonsultasi%20atau%20ikut%20kelas."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FF71CF] hover:bg-[#8B5CF6] hover:text-white text-black font-black text-xs px-5 py-3 rounded-xl brutal-border brutal-shadow-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Hasil ke Kak Nuy via WA
                  </a>
                  <button
                    onClick={() => {
                      window.location.hash = "layanan";
                    }}
                    className="inline-flex items-center gap-2 bg-white hover:bg-[#D9F99D] text-black font-black text-xs px-5 py-3 rounded-xl brutal-border brutal-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    Lihat Layanan Konseling
                  </button>
                </div>
              </div>

              <div className="flex justify-center border-t-2 border-black pt-8">
                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 text-xs text-[#8B5CF6] hover:text-[#FF71CF] font-black cursor-pointer bg-white px-4 py-2.5 rounded-xl brutal-border brutal-shadow-sm active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Ulangi Tes Kelekatan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
