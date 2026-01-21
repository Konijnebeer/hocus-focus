export default function Footer() {
  return (
    <footer className="p-4 mt-8 text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            &copy; {new Date().getFullYear()} Hocus Focus. All rights
            reserved.
          </div>
          <div className="flex-1 flex justify-end gap-8">
            <div>
              <p className="font-semibold mb-2">Social</p>
              <ul className="space-y-1">
                <li>X</li>
                <li>Instagram</li>
                <li>Youtube</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Legal</p>
              <ul className="space-y-1">
                <li>Terms of Service</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
