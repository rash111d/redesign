import Link from "next/link";
import { CalendarClock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { Project } from "@/types/api";
import { formatDate, statusLabel, statusTone } from "@/utils/format";

function deadlineInfo(deadline: string) {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (days < 0) return "Дедлайн прошёл";
  if (days === 0) return "Дедлайн сегодня";
  if (days === 1) return "Дедлайн завтра";
  if (days <= 7) return `Осталось ${days} дн.`;
  return formatDate(deadline);
}

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const freeSlots = project.free_slots ?? Math.max(project.capacity - (project.members?.length ?? 0), 0);
  const urgent = new Date(project.deadline).getTime() - Date.now() <= 7 * 86400000;

  return (
    <Card className="group overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/projects/${project.id}`} className="grid gap-4">
        <div className="flex flex-wrap gap-1.5">
          {project.is_suitable ? <Badge tone="success">Подходит мне</Badge> : null}
          {project.stack.slice(0, compact ? 3 : 5).map((skill) => (
            <Badge key={skill.id} tone="brand">{skill.name}</Badge>
          ))}
          <Badge tone={statusTone(project.status)}>{statusLabel(project.status)}</Badge>
        </div>

        <div>
          <h3 className="text-lg font-bold transition group-hover:text-brand">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{project.description}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm font-semibold ${urgent ? "border-warning bg-warning/10 text-ink" : "border-border"}`}>
            <CalendarClock size={17} />
            <div>
              <div className="text-xs text-muted">Дедлайн</div>
              <div>{deadlineInfo(project.deadline)}</div>
            </div>
          </div>
          <div className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm font-semibold ${freeSlots === 0 ? "border-danger bg-danger/10" : "border-border"}`}>
            <Users size={17} />
            <div>
              <div className="text-xs text-muted">Свободные места</div>
              <div>{freeSlots} из {project.capacity}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <Avatar name={project.owner?.name ?? "User"} src={project.owner?.avatar_url} size={28} />
          <span>{project.owner?.name ?? "Организатор"}</span>
        </div>
      </Link>
    </Card>
  );
}
