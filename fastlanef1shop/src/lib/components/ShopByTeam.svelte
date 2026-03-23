<script lang="ts">
  import { fly } from 'svelte/transition';
  import { base } from '$app/paths';
  import { categories } from '../stores/categories';
  import LucideArrowRight from '~icons/lucide/arrow-right';

  const teamColors: Record<string, string> = {
    'red-bull': '#3671C6',
    'ferrari': '#E8002D',
    'mercedes': '#27F4D2',
    'mclaren': '#FF8000',
    'aston-martin': '#229971',
    'alpine': '#FF87BC',
    'williams': '#64C4FF',
    'haas': '#B6BABD',
    'rb': '#6692FF',
    'sauber': '#52E252',
  };

  $: teamCategories = $categories
    .filter(c => c.type === 'team')
    .slice(0, 8);

  function getTeamColor(teamId: string): string {
    return teamColors[teamId] || '#E10600';
  }
</script>

{#if teamCategories.length > 0}
  <section class="py-16 px-4 bg-[#1c1b1b]">
    <div class="container mx-auto max-w-screen-xl">
      <div class="text-center mb-10">
        <h2 class="font-headline text-3xl font-bold text-white uppercase tracking-[0.1em] mb-4">
          Compra por Equipo
        </h2>
        <p class="text-surface-200 max-w-lg mx-auto">
          Encuentra modelos de tu escudería favorita
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each teamCategories as team, i}
          <a
            href={`${base}/categoria/${team.id}`}
            class="group bg-[#2a2a2a] p-5 text-center
            hover:bg-[#353534] transition-all duration-200 hover:-translate-y-0.5"
            style="--team-color: {getTeamColor(team.id)}"
            in:fly={{ y: 20, duration: 300, delay: i * 60 }}
          >
            <div class="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            {#if team.imagePath}
              <img
                src={team.imagePath}
                alt={team.name}
                class={`w-full h-full object-contain ${
                  team.id !== 'red-bull' ? 'brightness-0 invert' : ''
                }`}
                loading="lazy"
              />
            {:else}
              <div class="w-12 h-12 mx-auto mb-3 flex items-center justify-center"
                        style="background-color: {getTeamColor(team.id)}20;"
                      >
                        <div class="w-4 h-4" style="background-color: {getTeamColor(team.id)}"></div>
                      </div>
            {/if}
          </div>

            <h3 class="font-headline font-semibold text-white text-sm mb-1 uppercase tracking-wider group-hover:text-primary-400 transition-colors">
              {team.name}
            </h3>
            <span class="text-xs text-surface-300 flex items-center justify-center gap-1 font-headline uppercase tracking-wider group-hover:text-surface-200 transition-colors">
              Ver modelos
              <LucideArrowRight class="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}
