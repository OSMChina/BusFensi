interface PresetTagItem {
    '@_k': string,
    '@_v'?: string,
    importance: "required" | "important" | "recommened" | "optional" | "not-recommened"
    description?: string,
    example?: string
}

export interface FeaturePreset {
    tag: PresetTagItemp[]
}