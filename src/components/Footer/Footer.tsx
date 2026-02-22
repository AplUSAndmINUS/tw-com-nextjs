export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {year} Terence Waters. All rights reserved.</p>
      </div>
    </footer>
  );
}
