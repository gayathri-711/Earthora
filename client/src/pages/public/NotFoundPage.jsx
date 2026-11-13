import { Link } from 'react-router-dom';
import { Compass, Sprout } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-earthora-ivory min-h-screen py-24 flex items-center justify-center px-4">
      <div className="card-surface max-w-md w-full p-8 text-center border border-earthora-sand/80 shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-earthora-sand/40 text-earthora-forest">
          <Compass className="h-8 w-8 text-earthora-olive animate-spin" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-earthora-olive font-mono">
          404 Error
        </span>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
          Plot Coordinates Not Found
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-earthora-muted">
          The agricultural telemetry, field crop, or marketplace catalog page you requested could not be located.
        </p>
        <Link to="/" className="btn-accent mt-6 inline-flex text-xs font-bold py-2.5 px-6">
          Return to Earthora Home
        </Link>
      </div>
    </div>
  );
}
