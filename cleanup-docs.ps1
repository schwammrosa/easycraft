# Script de Limpeza de Documentação
# Remove arquivos obsoletos e duplicados

$obsoleteFiles = @(
    # Sprints antigos
    "docs\SPRINT1.md",
    "docs\SPRINT1_COMPLETE.md",
    "docs\SPRINT2_COMPLETE.md",
    "docs\SPRINT3_COMPLETE.md",
    "docs\SPRINT4_COMPLETE.md",
    "docs\SPRINT5_COMPLETE.md",
    "docs\SPRINT6_MARKETPLACE.md",
    "docs\SPRINT6_OPTIONS.md",
    "docs\SPRINT7_COMPLETE.md",
    "docs\SPRINT7_DUNGEONS_PLAN.md",
    "docs\SPRINT7_PROGRESS.md",
    "docs\SPRINT7_SUMMARY.md",
    "docs\SPRINT8_POLISH.md",
    "docs\SPRINT8_POLISH_DEPLOY_PLAN.md",
    "docs\CONTINUE_SPRINT7.md",
    
    # Status duplicados
    "docs\STATUS.md",
    "docs\STATUS_ATUAL.md",
    "docs\PROGRESS.md",
    "docs\PROGRESS_UPDATE.md",
    "docs\MVP_COMPLETE.md",
    "docs\DIA1_RESUMO.md",
    "docs\SESSION_SUMMARY.md",
    "docs\RESUMO_EXECUTIVO.md",
    "docs\FINAL_SUMMARY.md",
    
    # Próximos passos duplicados
    "docs\NEXT_STEPS.md",
    "docs\PROXIMOS_PASSOS.md",
    "docs\PROXIMOS_PASSOS_IMEDIATOS.md",
    
    # Refactor completo
    "docs\COMPLETE_REFACTOR.md",
    "docs\FRONTEND_REFACTOR_PLAN.md",
    "docs\FRONTEND_REFACTOR_COMPLETE.md",
    "docs\FRONTEND_CHECKLIST.md",
    "docs\FRONTEND_SUMMARY.md",
    "docs\REFACTOR_STATUS.md",
    "docs\REFACTORED_PAGES.md",
    "docs\TEXT_COLOR_FIX.md",
    
    # Setup duplicados
    "docs\SETUP.md",
    "docs\QUICKSTART.md",
    "docs\QUICK_START.md",
    "docs\QUICK_DEPLOY.md",
    "docs\DEPLOY_GUIDE.md",
    "docs\DEPLOY_VERCEL.md",
    "docs\DEPLOY_RENDER.md",
    "docs\RENDER_QUICKSTART.md",
    "docs\INSTALL_DEPENDENCIES.md",
    
    # Testes e updates temporários
    "docs\FARM_STATUS_TEST.md",
    "docs\QUICK_TEST_GATHERING.md",
    "docs\CHANGELOG_FARM_MODE.md",
    "docs\GATHERING_UPDATE.md",
    "docs\MARKETPLACE_QUANTITY_UPDATE.md",
    "docs\README_GATHERING.md",
    
    # Sistemas antigos
    "docs\SISTEMA_STATS.md",
    "docs\SISTEMA_STATS_RAGNAROK.md",
    
    # Arquivo de auditoria temporário
    "docs\_DOCUMENTATION_AUDIT.md",
    
    # Projeto status antigo
    "docs\PROJECT_STATUS.md"
)

$deletedCount = 0
$notFoundCount = 0

Write-Host "" 
Write-Host "Iniciando limpeza de documentacao..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $obsoleteFiles) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "[OK] Deletado: $file" -ForegroundColor Green
        $deletedCount++
    } else {
        Write-Host "[SKIP] Nao encontrado: $file" -ForegroundColor Yellow
        $notFoundCount++
    }
}

Write-Host ""
Write-Host "Resumo:" -ForegroundColor Cyan
Write-Host "   Arquivos deletados: $deletedCount" -ForegroundColor Green
Write-Host "   Arquivos nao encontrados: $notFoundCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "Limpeza concluida!" -ForegroundColor Green
Write-Host ""
