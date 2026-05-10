---
title: "Writing a Chess AI That Understands Pieces It's Never Seen"
date: "2026-04-02"
excerpt: "How I built a minimax AI for a chess roguelike with 21 piece types — including a Necromancer that raises undead pawns and a Bomber that explodes on death."
---

Standard chess AI is a solved-ish problem. Minimax with alpha-beta pruning, piece-square tables, maybe a neural network evaluation. But what happens when your chess game has 21 piece types, some of which fundamentally break the assumptions that chess engines rely on?

In [Checkmate Chaos](https://github.com/jon-kloss/checkmate-chaos), my roguelike deckbuilder crossed with chess, I have pieces like:

- **Necromancer** — when it captures an enemy, the captured piece is raised as a friendly undead pawn on your side
- **Bomber** — explodes on death, destroying all adjacent pieces (chain reactions possible)
- **Assassin** — teleports to any enemy piece within 3 squares, ignoring blocking
- **Hydra** — splits into two smaller pieces when captured

Each of these breaks fundamental assumptions in chess AI. Material evaluation? A Necromancer capture doesn't just remove an enemy — it adds a new friendly piece. King safety? Meaningless when an Assassin can teleport through your pawn shield.

## The evaluation problem

Traditional chess evaluation looks like:

```
score = material_balance + positional_score + king_safety + pawn_structure
```

Material balance (count piece values on each side) breaks down immediately:
- A Necromancer capturing a piece removes the enemy AND creates a friendly undead pawn. Net swing is larger than a normal capture.
- A Bomber dying near a cluster of your pieces is catastrophic even though _they_ lost material.
- A Hydra being "captured" actually creates two new threats.

## Static values with contextual bonuses

The core evaluation uses static material values for each piece type — standard pieces get traditional chess values, and each exotic piece gets a hand-tuned base value reflecting its average threat level. But static values alone can't capture positional context, so the AI layers boss-specific evaluation bonuses on top:

```gdscript
func evaluate_position(board_state, is_maximizing) -> float:
    var score = 0.0
    
    for piece in board_state.get_all_pieces():
        var value = PIECE_VALUES[piece.type]
        value += get_positional_bonus(piece)
        
        if piece.color == ai_color:
            score += value
        else:
            score -= value
    
    # Boss-specific evaluation adjustments
    score += evaluate_boss_context(board_state)
    
    return score
```

The positional bonuses come from piece-square tables — pre-computed values for each piece type on each square. I designed tables for each exotic piece based on their abilities:

- **Assassin:** Highest value in center (more teleport targets in range)
- **Necromancer:** Highest value near enemy clusters (more conversion targets)
- **Bomber:** Highest value in enemy territory, _negative_ value near friendly clusters

## Move ordering for alpha-beta

Alpha-beta pruning works best when you search the best moves first. The standard heuristic is MVV-LVA (Most Valuable Victim, Least Valuable Attacker) — prioritize capturing expensive pieces with cheap ones.

With exotic pieces, MVV-LVA needs modification. A Necromancer capture is always high-priority because the net swing is larger than a normal capture. A move that triggers a Bomber explosion near enemy pieces should score highly:

```gdscript
func score_move_for_ordering(move, board_state) -> float:
    var score = 0.0
    
    if move.is_capture:
        var victim_value = PIECE_VALUES[move.captured_piece.type]
        var attacker_value = PIECE_VALUES[move.piece.type]
        score = victim_value - (attacker_value * 0.1)  # MVV-LVA
        
        # Necromancer captures create a friendly piece — double value
        if move.piece.type == PieceType.NECROMANCER:
            score *= 2.0
        
        # Bomber explosions score based on splash damage
        if triggers_bomber_explosion(move, board_state):
            var splash = evaluate_explosion_damage(move, board_state)
            score += splash
    
    return score
```

## The chain reaction problem

Bombers create a unique challenge for search depth. When a Bomber dies, it destroys adjacent pieces. If one of those is another Bomber, it also explodes. This can cascade across the board.

In minimax, you can't just evaluate "after this move" — you need to fully resolve the chain reaction before evaluating the resulting position. The actual implementation handles this recursively with a depth cap:

```gdscript
func bomber_explode(position, board_state, chain_depth) -> void:
    var adjacent = get_adjacent_pieces(position, board_state)
    
    for target in adjacent:
        board_state.remove_piece(target.position)
        
        # Chain reaction — but capped at depth 2 to prevent infinite loops
        if target.type == PieceType.BOMBER and chain_depth < 2:
            bomber_explode(target.position, board_state, chain_depth + 1)
```

This means a single move evaluation might trigger 2-3 recursive explosion steps. At depth 4 in minimax, that's a lot of extra computation. I mitigate it by detecting potential chains during move ordering and limiting search depth when chains are likely (since the resulting position is chaotic enough that deep search has diminishing returns).

## Boss-specific behavior trees

The AI uses minimax with alpha-beta pruning at configurable depth (1-5 ply depending on difficulty). Regular difficulty uses the standard evaluation uniformly. Boss encounters need personality. The Swarm (a boss with 24 pawns) shouldn't play like a grandmaster — it should overwhelm with numbers. The Lich (who has phylacteries that must be destroyed before it can be checkmated) should protect its phylacteries aggressively.

I use boss-specific evaluation bonuses layered on top of minimax:

```gdscript
func evaluate_boss_context(board_state) -> float:
    var bonus = 0.0
    
    match boss_id:
        "the_lich":
            # Heavily reward phylactery safety
            for phylactery_pos in lich_phylacteries:
                if is_threatened(phylactery_pos, board_state):
                    bonus -= 500.0  # Massive penalty if phylactery threatened
                    
        "the_swarm":
            # Reward pawn advancement and board control
            bonus += count_advanced_pawns(board_state) * 15.0
            
        "the_fortress":
            # Reward holding defensive positions
            bonus += evaluate_wall_integrity(board_state)
    
    return bonus
```

The Lich's AI also has checkmate immunity while phylacteries exist — you have to destroy the phylactery objects on the board before the Lich can be mated.

## The result

The AI plays at a reasonable difficulty without feeling robotic. It makes smart decisions about exotic pieces — it won't move a Bomber adjacent to its own King, it prioritizes Necromancer captures, and it respects Assassin threat ranges. Boss encounters feel distinct because each boss has personality in its evaluation function.

The hardest part wasn't the algorithm. It was tuning piece-square tables and boss bonuses so the AI values exotic pieces correctly without becoming predictable. Too aggressive and it always plays the same "optimal" moves. Too conservative and it ignores exotic abilities entirely. The sweet spot is where the AI makes interesting decisions that surprise the player occasionally.
