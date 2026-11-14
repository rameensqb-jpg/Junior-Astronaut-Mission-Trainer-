import { Link } from "@tanstack/react-router";

const VARIANTS = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  warm: "btn-warm",
};

export default function ActionLink({ to, params, children, variant = "primary", icon: Icon, className = "", ...rest }) {
  return (
    <Link to={to} params={params} className={`${VARIANTS[variant] || VARIANTS.primary} focus-ring ${className}`} {...rest}>
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      <span>{children}</span>
    </Link>
  );
}
