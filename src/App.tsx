import { useState, useCallback } from 'react'
import { Video, Wand2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { ApiKeyInput } from './components/ApiKeyInput'
import { PromptInput } from './components/PromptInput'
import { ImageUrlInput } from './components/ImageUrlInput'
import { DurationSlider } from './components/DurationSlider'
import { AspectRatioSelect } from './components/AspectRatioSelect'
import { ResolutionSelect } from './components/ResolutionSelect'
import { VideoEditInput } from './components/VideoEditInput'
import { GenerateButton } from './components/GenerateButton'
import { StatusDisplay } from './components/StatusDisplay'
import { VideoPreview } from './components/VideoPreview'
import { useApiKey } from './hooks/useApiKey'
import { useVideoGeneration } from './hooks/useVideoGeneration'
import { useVideoEdit } from './hooks/useVideoEdit'
import type { AspectRatio, Resolution } from './types'

type Tab = 'generate' | 'edit'

export default function App() {
  const { apiKey, setApiKey } = useApiKey()
  const [activeTab, setActiveTab] = useState<Tab>('generate')

  // Generate state
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [duration, setDuration] = useState(5)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [resolution, setResolution] = useState<Resolution>('720p')

  // Edit state
  const [editVideoUrl, setEditVideoUrl] = useState('')
  const [editPrompt, setEditPrompt] = useState('')

  const generation = useVideoGeneration(apiKey)
  const edit = useVideoEdit(apiKey)

  const isGenerating = activeTab === 'generate' ? generation.isGenerating : edit.isGenerating
  const currentVideoUrl = activeTab === 'generate' ? generation.videoUrl : edit.videoUrl
  const currentStatus = activeTab === 'generate' ? generation.status : edit.status
  const currentError = activeTab === 'generate' ? generation.error : edit.error
  const currentElapsedTime = activeTab === 'generate' ? generation.elapsedTime : edit.elapsedTime
  const currentRequestId = activeTab === 'generate' ? generation.requestId : edit.requestId
  const currentDebugInfo = activeTab === 'generate' ? generation.debugInfo : edit.debugInfo

  const handleGenerate = useCallback(() => {
    generation.generate({
      prompt,
      imageUrl: imageUrl || undefined,
      duration,
      aspectRatio,
      resolution,
    })
  }, [generation, prompt, imageUrl, duration, aspectRatio, resolution])

  const handleEdit = useCallback(() => {
    edit.edit({
      videoUrl: editVideoUrl,
      prompt: editPrompt,
    })
  }, [edit, editVideoUrl, editPrompt])

  const handleReset = useCallback(() => {
    if (activeTab === 'generate') {
      generation.reset()
      setPrompt('')
      setImageUrl('')
    } else {
      edit.reset()
      setEditVideoUrl('')
      setEditPrompt('')
    }
  }, [activeTab, generation, edit])

  const canGenerate = activeTab === 'generate'
    ? apiKey.trim() !== '' && prompt.trim() !== '' && !isGenerating
    : apiKey.trim() !== '' && editVideoUrl.trim() !== '' && editPrompt.trim() !== '' && !isGenerating

  const handleAction = activeTab === 'generate' ? handleGenerate : handleEdit

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/10 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
              <Video className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              xAI Video Studio
            </h1>
          </div>
          <div className="flex justify-center mb-4">
            <div className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/40">
              <p className="text-sm font-medium">
                Shared by{' '}
                <a
                  href="https://x.com/KanaWorks_AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  @KanaWorks_AI
                </a>
                {' '}- Follow for more!
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Generate and edit videos using xAI's Grok Imagine Video model.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border bg-card p-1">
            <Button
              variant={activeTab === 'generate' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('generate')}
              disabled={isGenerating}
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              Generate
            </Button>
            <Button
              variant={activeTab === 'edit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('edit')}
              disabled={isGenerating}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Edit Video
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings Column */}
          <div className="space-y-6">
            {/* API Key Card */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Authentication</CardTitle>
                <CardDescription>
                  Enter your xAI API key to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiKeyInput value={apiKey} onChange={setApiKey} />
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {activeTab === 'generate' ? 'Video Generation' : 'Video Editing'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'generate'
                    ? 'Configure your video generation parameters'
                    : 'Provide a video and describe the changes you want'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'generate' ? (
                  <div className="space-y-6">
                    <PromptInput
                      value={prompt}
                      onChange={setPrompt}
                      disabled={isGenerating}
                    />
                    <ImageUrlInput
                      value={imageUrl}
                      onChange={setImageUrl}
                      disabled={isGenerating}
                    />
                    <DurationSlider
                      value={duration}
                      onChange={setDuration}
                      disabled={isGenerating}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <AspectRatioSelect
                        value={aspectRatio}
                        onChange={setAspectRatio}
                        disabled={isGenerating}
                      />
                      <ResolutionSelect
                        value={resolution}
                        onChange={setResolution}
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                ) : (
                  <VideoEditInput
                    videoUrl={editVideoUrl}
                    editPrompt={editPrompt}
                    onVideoUrlChange={setEditVideoUrl}
                    onEditPromptChange={setEditPrompt}
                    disabled={isGenerating}
                  />
                )}
              </CardContent>
            </Card>

            {/* Action Button */}
            <GenerateButton
              onClick={handleAction}
              isGenerating={isGenerating}
              disabled={!canGenerate}
              mode={activeTab}
            />
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <Card className="backdrop-blur-sm bg-card/80 min-h-[400px]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>
                  {activeTab === 'generate'
                    ? 'Your generated video will appear here'
                    : 'Your edited video will appear here'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatusDisplay
                  status={currentStatus}
                  error={currentError}
                  elapsedTime={currentElapsedTime}
                  requestId={currentRequestId}
                  debugInfo={currentDebugInfo}
                />
                {currentVideoUrl ? (
                  <VideoPreview videoUrl={currentVideoUrl} onReset={handleReset} />
                ) : (
                  !currentStatus && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <Video className="h-16 w-16 mb-4 opacity-20" />
                      <p className="text-center">
                        {activeTab === 'generate'
                          ? 'Enter a prompt and click Generate to create your video'
                          : 'Enter a video URL and edit instructions to get started'}
                      </p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="backdrop-blur-sm bg-card/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                {activeTab === 'generate' ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Be descriptive in your prompts for better results
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Include details about motion, lighting, and style
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Use an image URL for image-to-video generation
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Longer durations may take more time to generate
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Provide a publicly accessible video URL (max 8.7 seconds)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Describe specific changes: &quot;make objects larger&quot;, &quot;add slow motion&quot;
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      You can use previously generated video URLs
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Be specific about colors, movements, and effects
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by xAI Grok Imagine Video API</p>
        </footer>
      </div>
    </div>
  )
}
