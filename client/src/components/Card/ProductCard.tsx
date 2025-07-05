import { type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from '@/types/projectTypes';
import type { Task } from '@/types/taskType';

interface ProductCardProps {
    projectData?: Project[] | Task[];
    role: string;
}

const ProductCard: FC<ProductCardProps> = ({ projectData, role }) => {

    return (
        <div>
            <section>
                <h2 className="text-2xl font-semibold mb-4">Your {role}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {projectData?.map((project: any) => (
                        <Card key={project._id} className="bg-white shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {project.title}
                                    <Badge
                                        className={`${project.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                                            } text-white`}
                                    >
                                        {project.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default ProductCard