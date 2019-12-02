export interface Runner {
  cleanup(): Promise<any>

  run(event: any, context: any): Promise<any>
}
