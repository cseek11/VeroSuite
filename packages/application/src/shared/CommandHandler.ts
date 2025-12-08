import { Command } from './Command';
import { Result } from './Result';

/**
 * CommandHandler - Base class for command handlers
 * Executes commands and returns results
 */
export abstract class CommandHandler<TCommand extends Command, TResult> {
  /**
   * Handle the command
   */
  abstract execute(command: TCommand): Promise<Result<TResult>>;
}
