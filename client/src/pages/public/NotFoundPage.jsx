import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <img src="/assets/img/404.png" alt="Page not found" className="mb-6 max-h-56 w-auto" />
      <h1 className="font-display text-3xl font-semibold text-agriva-ink">Page Not Found</h1>
      <p className="mt-2 text-sm text-agriva-muted">
        The field or harvest page you requested could not be found.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Return to Homepage
      </Link>
    </div>
  );
}

