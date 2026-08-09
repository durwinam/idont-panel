type ClientCardCommentProps = {
  comment?: string;
  className?: string;
};

export default function ClientCardComment({
  comment,
  className = 'client-card-comment',
}: ClientCardCommentProps) {
  if (!comment) return null;

  return (
    <span
      className={className}
      title={comment}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        maxWidth: '100%',
        padding: '5px 11px',
        borderRadius: '999px',

        /* Glass background */
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(45,212,191,0.08))',

        /* Glass border */
        border: '1px solid rgba(255,255,255,0.20)',

        /* Typography */
        color: 'inherit',
        fontSize: '12px',
        lineHeight: '18px',
        fontWeight: 500,
        letterSpacing: '0.01em',

        /* Text overflow */
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',

        /* Glass shadow */
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 18px rgba(0,0,0,0.08)',

        /* Glass blur */
        backdropFilter: 'blur(16px) saturate(170%)',
        WebkitBackdropFilter: 'blur(16px) saturate(170%)',

        /* Smooth animation */
        transition:
          'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.35)';
        e.currentTarget.style.boxShadow =
          'inset 0 1px 0 rgba(255,255,255,0.3), 0 6px 22px rgba(45,212,191,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
        e.currentTarget.style.boxShadow =
          'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 18px rgba(0,0,0,0.08)';
      }}
    >
      {comment}
    </span>
  );
}
