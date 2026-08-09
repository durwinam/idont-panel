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
padding: '5px 10px',
borderRadius: '999px',
background:
'linear-gradient(135deg, rgba(129, 140, 248, 0.13), rgba(45, 212, 191, 0.10))',
border: '1px solid rgba(129, 140, 248, 0.20)',
color: 'inherit',
fontSize: '12px',
lineHeight: '18px',
fontWeight: 500,
letterSpacing: '0.01em',
whiteSpace: 'nowrap',
overflow: 'hidden',
textOverflow: 'ellipsis',
verticalAlign: 'middle',
boxShadow:
'inset 0 1px 0 rgba(255,255,255,0.16), 0 4px 12px rgba(79,70,229,0.07)',
backdropFilter: 'blur(12px) saturate(150%)',
WebkitBackdropFilter: 'blur(12px) saturate(150%)',
}}
>
{comment} </span>
);
}
