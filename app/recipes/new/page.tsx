import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewRecipePage() {
  const heroImage =
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=2000&q=80";
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-10 lg:px-10">
        <header className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-stone-200 bg-white shadow-sm">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10" />
            <div className="relative flex flex-col gap-3 px-8 py-8 text-stone-100">
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.25em] text-stone-200/80"
              >
                Back to recipes
              </Link>
              <h1 className="text-2xl font-semibold tracking-tight">
                Add a new recipe
              </h1>
              <p className="max-w-lg text-sm text-stone-200/80">
                Start with the essentials and refine the details later.
              </p>
              <div>
                <Button className="rounded-full bg-white/90 px-5 text-stone-900 hover:bg-white">
                  Save draft
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 flex flex-col gap-6">
          <Card className="rounded-3xl border border-stone-200 bg-white/90 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold">Recipe details</h2>
              <p className="text-sm text-stone-500">
                Keep it simple now, refine later with the editor.
              </p>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-700">
                  Title
                </label>
                <Input
                  placeholder="Citrus sheet-pan salmon"
                  className="h-11 rounded-2xl border-stone-200 px-4"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-700">
                  Summary
                </label>
                <Input
                  placeholder="Bright, herb-forward dinner in 20 minutes"
                  className="h-11 rounded-2xl border-stone-200 px-4"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-700">
                  Tags
                </label>
                <Input
                  placeholder="dinner, quick, protein"
                  className="h-11 rounded-2xl border-stone-200 px-4"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-700">
                  Recipe content
                </label>
                <Textarea
                  placeholder="Paste ingredients and steps here"
                  className="min-h-[180px] rounded-2xl border-stone-200 px-4 py-3"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="ghost" className="rounded-full px-6">
                  Cancel
                </Button>
                <Button className="rounded-full px-6">Save recipe</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
