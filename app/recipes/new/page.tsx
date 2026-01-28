 "use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function NewRecipePage() {
  const heroImage =
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=2000&q=80";
  const [sourceType, setSourceType] = useState("paste");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [sourceReference, setSourceReference] = useState("");
  const [sourceFileName, setSourceFileName] = useState("");
  const [reviewed, setReviewed] = useState(false);

  const sourceSummary = useMemo(() => {
    if (sourceType === "url") {
      return sourceUrl ? `URL: ${sourceUrl}` : "URL source not added yet.";
    }
    if (sourceType === "paste") {
      return sourceText
        ? "Pasted text will prefill your recipe."
        : "Paste source text to continue.";
    }
    if (sourceType === "screenshot") {
      return sourceFileName
        ? `Screenshot: ${sourceFileName}`
        : "Screenshot reference stored for manual entry.";
    }
    return sourceReference
      ? `Social link: ${sourceReference}`
      : "Social link stored for reference.";
  }, [sourceFileName, sourceReference, sourceText, sourceType, sourceUrl]);

  const canSave = reviewed;
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
              <h2 className="text-lg font-semibold">Capture source</h2>
              <p className="text-sm text-stone-500">
                Choose how you want to bring a recipe in.
              </p>
            </CardHeader>
            <CardContent className="grid gap-5">
              <Tabs
                value={sourceType}
                onValueChange={setSourceType}
                className="w-full"
              >
                <TabsList className="grid h-12 w-full grid-cols-4 rounded-full bg-stone-100">
                  <TabsTrigger value="paste" className="rounded-full">
                    Paste
                  </TabsTrigger>
                  <TabsTrigger value="url" className="rounded-full">
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="screenshot" className="rounded-full">
                    Screenshot
                  </TabsTrigger>
                  <TabsTrigger value="social" className="rounded-full">
                    Social
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4 grid gap-3">
                  <label className="text-sm font-medium text-stone-700">
                    Paste text
                  </label>
                  <Textarea
                    placeholder="Paste the recipe, ingredients, or notes"
                    value={sourceText}
                    onChange={(event) => setSourceText(event.target.value)}
                    className="min-h-[160px] rounded-2xl border-stone-200 px-4 py-3"
                  />
                  <p className="text-xs text-stone-500">
                    We will prefill your recipe content from this text.
                  </p>
                </TabsContent>
                <TabsContent value="url" className="mt-4 grid gap-3">
                  <label className="text-sm font-medium text-stone-700">
                    Recipe URL
                  </label>
                  <Input
                    placeholder="https://example.com/recipe"
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    className="h-11 rounded-2xl border-stone-200 px-4"
                  />
                  <p className="text-xs text-stone-500">
                    We will fetch the title and extract the body.
                  </p>
                </TabsContent>
                <TabsContent value="screenshot" className="mt-4 grid gap-3">
                  <label className="text-sm font-medium text-stone-700">
                    Upload screenshot
                  </label>
                  <Input
                    type="file"
                    onChange={(event) =>
                      setSourceFileName(event.target.files?.[0]?.name ?? "")
                    }
                    className="h-11 rounded-2xl border-stone-200 px-4"
                  />
                  <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-500">
                    {sourceFileName
                      ? `Selected: ${sourceFileName}`
                      : "Screenshots are stored for manual entry."}
                  </div>
                </TabsContent>
                <TabsContent value="social" className="mt-4 grid gap-3">
                  <label className="text-sm font-medium text-stone-700">
                    Social link
                  </label>
                  <Input
                    placeholder="Paste a link from Instagram, TikTok, etc."
                    value={sourceReference}
                    onChange={(event) => setSourceReference(event.target.value)}
                    className="h-11 rounded-2xl border-stone-200 px-4"
                  />
                  <p className="text-xs text-stone-500">
                    We will store the link for reference.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-700">
                  Source reference
                </label>
                <Input
                  placeholder="Optional link or source notes"
                  value={sourceReference}
                  onChange={(event) => setSourceReference(event.target.value)}
                  className="h-11 rounded-2xl border-stone-200 px-4"
                />
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600">
                {sourceSummary}
              </div>
              <label className="flex items-center gap-3 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={reviewed}
                  onChange={(event) => setReviewed(event.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-stone-900"
                />
                I have reviewed the captured content before saving.
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="ghost" className="rounded-full px-6">
                  Cancel
                </Button>
                <Button
                  className="rounded-full px-6"
                  disabled={!canSave}
                >
                  Save recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
