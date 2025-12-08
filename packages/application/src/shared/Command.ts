/**
 * Command - Base class for commands
 * Commands represent requests to change state in the system
 * Each command is immutable and represents a single business action
 */
export abstract class Command {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
  }

  /**
   * Get the command type name
   */
  abstract getCommandName(): string;
}
