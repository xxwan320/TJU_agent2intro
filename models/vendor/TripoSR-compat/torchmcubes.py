import torch
from skimage.measure import marching_cubes as mc
def marching_cubes(volume, threshold):
 v,f,_,_=mc(volume.detach().cpu().numpy(),level=threshold)
 return torch.from_numpy(v[:,[2,1,0]].copy()),torch.from_numpy(f.astype("int64").copy())
