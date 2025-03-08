interface PresetTagItem {
    '@_k': string,
    '@_v'?: string,
    importance: "required" | "recommened" | "optional" | "not-recommened"
    description?: string,
    example?: string
}

export interface NodePreset {
    tag: PresetTagItemp[]
}