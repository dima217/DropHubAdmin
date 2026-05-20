export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('admin-theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.dataset.theme='dark';}else{document.documentElement.dataset.theme='light';}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
