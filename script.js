// Dark mode toggle
document.getElementById("toggleMode").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    document.getElementById("toggleMode").textContent = isDark ? "🌙" : "☀️";
  });
  
  // Animasi scroll
  AOS.init();
  
  // Kontak form handler
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nama = this.nama.value;
    const email = this.email.value;
    const pesan = this.pesan.value;
  
    if (nama && email && pesan) {
      document.getElementById("formMessage").textContent = "Pesan berhasil dikirim!";
      this.reset();
    } else {
      document.getElementById("formMessage").textContent = "Harap isi semua kolom!";
    }
  });